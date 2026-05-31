import { AdminSidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/dashboard/topbar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-[260px] pt-16 lg:pt-0 min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[90rem] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
