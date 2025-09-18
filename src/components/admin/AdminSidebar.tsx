import { Link } from "react-router-dom";
import { Car, Users, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const navItems = [
    { name: "Преглед", path: "/admin/overview", icon: LayoutDashboard },
    { name: "Клиенти", path: "/admin/clients", icon: Users },
    { name: "Ремонти", path: "/admin/repairs", icon: Car },
    { name: "Настройки", path: "/admin/settings", icon: Settings }, // Placeholder for future settings
  ];

  return (
    <aside className={cn("w-64 bg-sidebar text-sidebar-foreground p-4 border-r border-sidebar-border", className)}>
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo.png" alt="MERT AI Logo" className="h-10" />
        <span className="text-xl font-semibold text-sidebar-primary-foreground">MERT AI Admin</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;