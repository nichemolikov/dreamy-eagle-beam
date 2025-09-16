import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const navLinks = [
  { to: "/", label: "Начало" },
  { to: "/services", label: "Услуги" },
  { to: "/about", label: "За нас" },
  { to: "/contact", label: "Контакти" },
  { to: "/faq", label: "ЧЗВ" },
];

const NavLinks = ({ className }: { className?: string }) => (
  <nav className={className}>
    {navLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `transition-colors hover:text-white ${isActive ? "text-white font-semibold" : "text-[#f1f1f1]"}`
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
    <header className="sticky top-0 flex h-24 items-center justify-between border-b border-gray-700 bg-[#211f1f] px-4 md:px-6 z-50">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <img src="/logo.png" alt="MERT AI Logo" className="h-20  />
        <span className="text-xl font-bold text-[#f1f1f1]">MERT AI</span>
      </Link>

      <div className="hidden md:flex justify-center">
        <NavLinks className="flex items-center gap-5 text-sm lg:gap-6" />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              <Button onClick={() => navigate("/dashboard")} variant="outline" className="text-[#f1f1f1] border-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#211f1f]">Табло</Button>
              <Button onClick={handleLogout} variant="outline" className="text-[#f1f1f1] border-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#211f1f]">Изход</Button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")} variant="outline" className="text-[#f1f1f1] border-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#211f1f]">Вход за клиенти</Button>
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden text-[#f1f1f1] border-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#211f1f]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Превключване на навигационното меню</span>
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