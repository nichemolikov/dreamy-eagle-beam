import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-100/50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-semibold">AutoRepair Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoRepair Pro. Всички права запазени.
          </p>
          <nav className="flex gap-4">
            <Link to="/about" className="text-sm hover:underline">За нас</Link>
            <Link to="/contact" className="text-sm hover:underline">Контакти</Link>
            <Link to="/services" className="text-sm hover:underline">Услуги</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;