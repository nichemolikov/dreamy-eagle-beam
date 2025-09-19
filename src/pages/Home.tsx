import Hero from "@/components/home/Hero";
import ServicesHighlight from "@/components/home/ServicesHighlight";
import AboutUsSection from "@/components/home/AboutUsSection";
import FaqSection from "@/components/home/FaqSection";
import ContactPageContent from "@/components/ContactPageContent"; // Updated import

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesHighlight />
      <AboutUsSection />
      <ContactPageContent /> {/* Using the new ContactPageContent */}
      <FaqSection />
    </div>
  );
};

export default Home;