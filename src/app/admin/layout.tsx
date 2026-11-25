import { AdminSidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <AdminSidebar />
      <main className="lg:ml-[270px] pb-24 lg:pb-6 min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 p-4 sm:p-5 lg:p-6 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
