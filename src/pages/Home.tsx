import Hero from "@/components/home/Hero";
import ServicesHighlight from "@/components/home/ServicesHighlight";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FaqSection from "@/components/home/FaqSection";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesHighlight />
      <WhyChooseUs />
      <FaqSection />
    </div>
  );
};

export default Home;