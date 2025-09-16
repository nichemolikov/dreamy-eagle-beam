import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

const NavLinks = ({ className }: { className?: string }) => (
  <nav className={className}>
    {navLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `transition-colors hover:text-primary ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`
        }
      >
        {link.label}
      </NavLink>
    ))}
  </nav>
);

const Header = ({ session }: { session: Session | null }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <Wrench className="h-6 w-6 text-primary" />
        <span className="">AutoRepair Pro</span>
      </Link>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <NavLinks className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6" />
        <div className="ml-auto flex-1 sm:flex-initial">
          {session ? (
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/dashboard")} variant="outline">Dashboard</Button>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/login")}>Client Login</Button>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <NavLinks className="grid gap-6 text-lg font-medium" />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;