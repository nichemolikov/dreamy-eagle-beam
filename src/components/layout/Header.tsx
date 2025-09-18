import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = false; // This should come from your auth context

  const navItems = [
    { name: "Начало", path: "/" },
    { name: "За нас", path: "/about" },
    { name: "Услуги", path: "/services" },
    { name: "Контакти", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-[#211f1f] py-4">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="MERT AI Logo" className="h-16" />
          <span className="text-2xl font-semibold text-[#f1f1f1]">MERT AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="text-sm font-medium text-[#f1f1f1] hover:underline">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Button variant="ghost" className="text-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#211f1f]">Профил</Button>
          ) : (
            <Button onClick={() => navigate("/login")} variant="ghost">Вход за клиенти</Button>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-[#f1f1f1]" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#211f1f] text-[#f1f1f1]">
            <div className="flex flex-col gap-6 p-6">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className="text-lg font-medium hover:underline" onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <Button variant="ghost" className="text-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#211f1f]" onClick={() => setIsOpen(false)}>Профил</Button>
              ) : (
                <Button onClick={() => { navigate("/login"); setIsOpen(false); }} variant="default">Вход за клиенти</Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;