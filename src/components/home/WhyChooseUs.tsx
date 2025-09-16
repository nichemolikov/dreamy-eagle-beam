import { ShieldCheck, Users, ThumbsUp } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Сертифицирани механици",
    description: "Нашият екип се състои от висококвалифицирани и сертифицирани професионалисти, посветени на качествената изработка.",
  },
  {
    icon: <ThumbsUp className="h-10 w-10 text-primary" />,
    title: "Качествени части",
    description: "Използваме само оригинални (OEM) или висококачествени резервни части, за да гарантираме производителността и дълготрайността на вашия автомобил.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Фокус върху клиента",
    description: "Приоритет за нас са ясната комуникация и прозрачните цени. Всички ремонти се одобряват първо от вас.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Защо да изберете MERT AI?</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Обслужване. Надеждност. Доверие.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;