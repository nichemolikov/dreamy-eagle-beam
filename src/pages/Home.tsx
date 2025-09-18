import Hero from "@/components/home/Hero";
import ServicesHighlight from "@/components/home/ServicesHighlight";
import AboutUsSection from "@/components/home/AboutUsSection"; // Актуализиран импорт
import FaqSection from "@/components/home/FaqSection";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesHighlight />
      <AboutUsSection /> {/* Актуализирано използване */}
      <FaqSection />
    </div>
  );
};

export default Home;