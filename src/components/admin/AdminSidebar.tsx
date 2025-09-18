import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Car, Users, LayoutDashboard, Settings, LogOut } from "lucide-react"; // Import LogOut icon
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const navItems = [
    { name: "Преглед", path: "/admin/overview", icon: LayoutDashboard },
    { name: "Клиенти", path: "/admin/clients", icon: Users },
    { name: "Ремонти", path: "/admin/repairs", icon: Car },
    { name: "Настройки", path: "/admin/settings", icon: Settings }, // Placeholder for future settings
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <aside className={cn("w-64 bg-sidebar text-sidebar-foreground p-4 border-r border-sidebar-border flex flex-col", className)}>
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo.png" alt="MERT AI Logo" className="h-10" />
        <span className="text-xl font-semibold text-sidebar-primary-foreground">MERT AI Admin</span>
      </div>
      <nav className="space-y-2 flex-grow"> {/* Use flex-grow to push logout to bottom */}
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
      <div className="mt-auto pt-4 border-t border-sidebar-border"> {/* Logout button at the bottom */}
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Изход
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;