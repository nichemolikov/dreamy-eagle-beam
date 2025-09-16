import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-700 bg-[#211f1f]">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MERT AI Logo" className="h-8" />
            <span className="font-semibold text-[#f1f1f1]">MERT AI</span>
          </div>
          <p className="text-sm text-[#f1f1f1]">
            © {new Date().getFullYear()} MERT AI. Всички права запазени.
          </p>
          <nav className="flex gap-4">
            <Link to="/about" className="text-sm hover:underline text-[#f1f1f1]">За нас</Link>
            <Link to="/contact" className="text-sm hover:underline text-[#f1f1f1]">Контакти</Link>
            <Link to="/services" className="text-sm hover:underline text-[#f1f1f1]">Услуги</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;