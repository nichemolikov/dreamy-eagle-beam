import Hero from "@/components/home/Hero";
import ServicesHighlight from "@/components/home/ServicesHighlight";
import AboutUsSection from "@/components/home/AboutUsSection";
import FaqSection from "@/components/home/FaqSection";
import ContactSection from "@/components/home/ContactSection";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesHighlight />
      <AboutUsSection />
      <ContactSection /> {/* ContactSection остава преди FaqSection */}
      <FaqSection /> {/* FaqSection е преместена най-долу, преди футъра */}
    </div>
  );
};

export default Home;