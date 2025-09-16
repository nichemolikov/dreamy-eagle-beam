import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, BatteryCharging, CircleDot } from "lucide-react";

const services = [
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Двигател и трансмисия",
    description: "Цялостна диагностика на двигателя, ремонти и обслужване на трансмисията, за да поддържате автомобила си в перфектно състояние.",
  },
  {
    icon: <CircleDot className="h-8 w-8 text-primary" />,
    title: "Спирачни услуги",
    description: "Експертни прегледи, ремонти и смяна на спирачки за вашата безопасност и спокойствие на пътя.",
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: "Гуми и реглаж",
    description: "Професионални услуги за гуми, включително ротация, балансиране и прецизен реглаж на колелата.",
  },
  {
    icon: <BatteryCharging className="h-8 w-8 text-primary" />,
    title: "Електрическа диагностика",
    description: "Разширена диагностика за откриване и разрешаване на всякакви електрически проблеми във вашия автомобил.",
  },
];

const ServicesHighlight = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Нашите най-популярни услуги</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Предлагаме широка гама от услуги, за да отговорим на всички ваши нужди за ремонт на автомобили.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary">
              <CardHeader className="flex flex-col items-center text-center">
                {React.cloneElement(service.icon, { className: `${service.icon.props.className} transition-colors group-hover:text-primary-foreground` })}
                <CardTitle className="mt-4 transition-colors group-hover:text-primary-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground/90">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlight;