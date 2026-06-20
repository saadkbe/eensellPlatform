"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

// Get all community posts (pinned first, then by date)
export async function getPosts() {
  return db.communityPost.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
        },
      },
    },
  });
}

// Create a new community post (admin-only)
export async function createPost(title: string, content: string) {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") throw new Error("Only admins can create posts");

  const post = await db.communityPost.create({
    data: {
      title,
      content,
      authorId: user.id,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
        },
      },
    },
  });

  // Send Premium Email Template for Community Post
  const activeUsers = await db.user.findMany({
    where: { status: "ACTIVE" },
    select: { email: true, firstName: true },
  });
  
  if (activeUsers.length > 0) {
    const { sendCommunityPostEmail } = await import("./email.actions");
    const recipients = activeUsers.map(u => ({ 
      email: u.email!, 
      name: u.firstName || "Student" 
    }));
    await sendCommunityPostEmail(recipients, title, "/dashboard/community");
    
    const { notifyAllActiveUsers } = await import("./notification.actions");
    await notifyAllActiveUsers({
      title: "New Community Post",
      message: `A new post "${title}" has been published.`,
      linkUrl: "/dashboard/community",
      skipEmail: true,
    });
  }

  revalidatePath("/dashboard/community");
  return post;
}

// Toggle pin status (admin-only)
export async function togglePinPost(postId: string) {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") throw new Error("Only admins can pin posts");

  const post = await db.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  await db.communityPost.update({
    where: { id: postId },
    data: { isPinned: !post.isPinned },
  });

  revalidatePath("/dashboard/community");
}

// Delete a post (admin-only)
export async function deletePost(postId: string) {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") throw new Error("Only admins can delete posts");

  await db.communityPost.delete({ where: { id: postId } });
  revalidatePath("/dashboard/community");
}
