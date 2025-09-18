import HeroSection from "@/components/home/HeroSection";
import ServicesHighlight from "@/components/home/ServicesHighlight";
import Testimonials from "@/components/home/Testimonials";
import ContactForm from "@/components/home/ContactForm";
import AboutUsSection from "@/components/home/AboutUsSection"; // Актуализиран импорт

export default function Index() {
  return (
    <>
      <HeroSection />
      <ServicesHighlight />
      <AboutUsSection /> {/* Актуализирано използване */}
      <Testimonials />
      <ContactForm />
    </>
  );
}