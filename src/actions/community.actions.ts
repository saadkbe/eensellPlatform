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
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              role: true,
            },
          },
        },
      },
      _count: {
        select: {
          reactions: true,
          comments: true,
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
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              role: true,
            },
          },
        },
      },
      _count: {
        select: {
          reactions: true,
          comments: true,
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

// Share a 60-Day Roadmap Milestone Win to Community
export async function shareMilestoneWinToCommunity(
  dayNumber: number,
  reflectionText?: string
) {
  const user = await getAuthUser();
  const { getRoadmapDay } = await import("@/data/roadmap-data");
  const roadmap = getRoadmapDay(dayNumber);

  const title = `🏆 Completed Day ${roadmap.dayNumber}: ${roadmap.title}`;

  // Check if user already shared this milestone recently to prevent accidental duplicates
  const existingPost = await db.communityPost.findFirst({
    where: {
      authorId: user.id,
      title,
      createdAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    },
  });

  if (existingPost) {
    return {
      success: true,
      post: existingPost,
      alreadyShared: true,
      postId: existingPost.id,
    };
  }

  const deliverablesHtml = roadmap.deliverables
    .map((d) => `<li>✅ ${d}</li>`)
    .join("");

  const formattedReflection =
    reflectionText && reflectionText.trim()
      ? `<div style="margin-top: 12px; padding: 12px; background: rgba(245, 158, 11, 0.08); border-left: 3px solid #f59e0b; border-radius: 8px;"><strong>💡 Key Takeaway / Lesson:</strong><p style="margin: 4px 0 0 0;">${reflectionText
          .trim()
          .replace(/\n/g, "<br />")}</p></div>`
      : "";

  const content = `
    <p>🚀 <strong>Boom! Just crushed Day ${roadmap.dayNumber} in the 60-Day AI Automation Agency Sprint.</strong></p>
    <p><strong>🎯 Phase:</strong> ${roadmap.phaseName} &bull; <strong>Est. Time:</strong> ${roadmap.estimatedTime}</p>
    <p><strong>⚡ Core Deliverables Completed:</strong></p>
    <ul>${deliverablesHtml}</ul>
    ${formattedReflection}
    <p style="margin-top: 10px;"><em>+50 XP Claimed! Keep stacking wins, Eensell family! 🔥</em></p>
  `.trim();

  const post = await db.communityPost.create({
    data: {
      title,
      content,
      authorId: user.id,
      isPinned: false,
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
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              role: true,
            },
          },
        },
      },
      _count: {
        select: {
          reactions: true,
          comments: true,
        },
      },
    },
  });

  revalidatePath("/dashboard/community");
  revalidatePath("/dashboard/challenge");
  return { success: true, post, postId: post.id };
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

// Toggle a reaction on a post
export async function toggleReaction(postId: string, emoji: string) {
  const user = await getAuthUser();

  const existing = await db.postReaction.findUnique({
    where: {
      userId_postId_emoji: {
        userId: user.id,
        postId,
        emoji,
      },
    },
  });

  if (existing) {
    await db.postReaction.delete({ where: { id: existing.id } });
  } else {
    await db.postReaction.create({
      data: {
        emoji,
        userId: user.id,
        postId,
      },
    });
  }

  revalidatePath("/dashboard/community");
  return !existing; // true if added, false if removed
}

// Add a comment to a post
export async function addComment(postId: string, content: string) {
  const user = await getAuthUser();
  if (!content.trim()) throw new Error("Comment cannot be empty");

  const comment = await db.postComment.create({
    data: {
      content: content.trim(),
      userId: user.id,
      postId,
    },
    include: {
      user: {
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

  revalidatePath("/dashboard/community");
  return comment;
}

// Delete a comment (author or admin)
export async function deleteComment(commentId: string) {
  const user = await getAuthUser();
  const comment = await db.postComment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized to delete this comment");
  }

  await db.postComment.delete({ where: { id: commentId } });
  revalidatePath("/dashboard/community");
}

// Get current user's ID for client-side reaction checking
export async function getCurrentUserId() {
  const user = await getAuthUser();
  return user.id;
}
