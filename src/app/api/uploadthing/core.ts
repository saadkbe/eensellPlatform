import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

const auth = async () => {
  const user = await currentUser();
  if (!user) {
    console.log("Upload auth failed: No user found");
    return null;
  }
  
  const isAdmin = user.publicMetadata.role === "ADMIN" || user.id === process.env.ADMIN_CLERK_ID;
  if (!isAdmin) {
    console.log("Upload auth failed: User is not ADMIN", user.id);
    return null;
  }
  
  return { id: user.id };
};

export const ourFileRouter = {
  // Define a route for uploading module images
  moduleImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Define a route for lesson resources (PDFs, docs)
  lessonResource: f({ pdf: { maxFileSize: "16MB" }, text: { maxFileSize: "16MB" }, image: { maxFileSize: "8MB" }, blob: { maxFileSize: "16MB" } })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resource upload complete for userId:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
