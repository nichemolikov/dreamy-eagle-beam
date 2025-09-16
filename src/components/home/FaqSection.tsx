import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "За какви видове превозни средства сте специализирани?",
    answer: "Обслужваме всички марки и модели, включително европейски, азиатски и местни автомобили. Нашите механици са обучени да се справят с всичко - от рутинна поддръжка до сложни ремонти.",
  },
  {
    question: "Какви части използвате за ремонтите?",
    answer: "Използваме оригинални (OEM) части, когато е възможно, за да осигурим най-доброто качество и съвместимост. Ако OEM части не са налични, използваме висококачествени резервни части, които отговарят или надвишават стандартите на производителя.",
  },
  {
    question: "Предлагате ли гаранция за ремонтите си?",
    answer: "Да, ние стоим зад работата си. Предлагаме пълна гаранция както за частите, така и за труда по всички наши ремонти. Моля, попитайте нашия сервизен консултант за конкретни подробности относно вашата услуга.",
  },
  {
    question: "Колко време отнема стандартното обслужване?",
    answer: "Продължителността на обслужването зависи от работата. Малки услуги като смяна на масло могат да бъдат извършени за около час, докато по-сложни ремонти може да отнемат повече време. Винаги предоставяме приблизително време за завършване и ви държим в течение.",
  },
];

const FaqSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Често задавани въпроси</h2>
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