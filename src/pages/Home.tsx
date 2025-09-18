import Hero from "@/components/home/Hero";
import ServicesHighlight from "@/components/home/ServicesHighlight";
import AboutUsSection from "@/components/home/AboutUsSection";
import FaqSection from "@/components/home/FaqSection";
import ContactSection from "@/components/home/ContactSection"; // Нов импорт

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesHighlight />
      <AboutUsSection />
      <FaqSection />
      <ContactSection /> {/* Добавяне на новата секция за контакт */}
    </div>
  );
};

export default Home;