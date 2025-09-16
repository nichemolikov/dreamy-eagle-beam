import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of vehicles do you specialize in?",
    answer: "We service all makes and models, including European, Asian imports, and domestic vehicles. Our mechanics are trained to handle everything from routine maintenance to complex repairs.",
  },
  {
    question: "What kind of parts do you use for repairs?",
    answer: "We use OEM (Original Equipment Manufacturer) parts whenever possible to ensure the best quality and compatibility. If OEM parts are not available, we use high-quality aftermarket parts that meet or exceed manufacturer standards.",
  },
  {
    question: "Do you offer any warranties on your repairs?",
    answer: "Yes, we stand behind our work. We offer a comprehensive warranty on both parts and labor for all our repairs. Please ask our service advisor for specific details regarding your service.",
  },
  {
    question: "How long does a typical service take?",
    answer: "Service duration depends on the job. Minor services like oil changes can be done in about an hour, while more complex repairs may take longer. We always provide an estimated completion time and keep you updated.",
  },
];

const FaqSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;