import { createClerkClient } from "@clerk/backend";
import "dotenv/config";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function check() {
  const user = await clerk.users.getUser("user_3DmwnOvwR5FFwp0QRxfzlaFBYZh");
  console.log("Metadata:", user.publicMetadata);
}
check();
