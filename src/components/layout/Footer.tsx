import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-700 bg-[#211f1f]">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="MERT AI Logo"
              className="h-24 [transform:rotateY(180deg)]"
            />
            <span className="text-3xl font-semibold text-[#f1f1f1]">
              MERT AI
            </span>
            <img
              src="/logo.png"
              alt="MERT AI Logo"
              className="h-24"
            />
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/about" className="text-sm hover:underline text-[#f1f1f1]">
              За нас
            </Link>
            <Link to="/contact" className="text-sm hover:underline text-[#f1f1f1]">
              Контакти
            </Link>
            <Link to="/services" className="text-sm hover:underline text-[#f1f1f1]">
              Услуги
            </Link>
          </nav>
          <p className="text-sm text-[#f1f1f1]">
            © {new Date().getFullYear()} MERT AI. Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;