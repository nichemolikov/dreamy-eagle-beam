import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { MadeWithDyad } from "@/components/made-with-dyad";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <header className="w-full bg-card border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Административен панел</h1>
          {/* User profile/logout can go here */}
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default AdminLayout;