import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Tire, Wrench, CarFront, Hammer, Globe } from "lucide-react"; // Добавени нови икони

const services = [
  {
    icon: <Truck className="h-8 w-8 text-primary" />,
    title: "Денонощна Пътна Помощ",
    description: "Денонощна пътна помощ в Разград, България и цяла Европа. Предлагаме 24/7 репатрак услуги, смяна на гуми, подаване на ток и доставка на гориво. Бързо, надеждно и винаги на разположение!",
  },
  {
    icon: <Tire className="h-8 w-8 text-primary" />,
    title: "Мобилен Сервиз за Гуми",
    description: "Спукана гума на пътя или нямате резервна? Ние можем да я поправим, да доставим нова и да я монтираме на място.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Автосервиз",
    description: "Разполагаме с професионален сервиз в Разград. От ремонти на двигатели и скоростни кутии до смяна на масла и ремонт на ходова част – ние се грижим за вашия автомобил.",
  },
  {
    icon: <CarFront className="h-8 w-8 text-primary" />,
    title: "Превоз на Пътници от Аварирал Автомобил",
    description: "Предлагаме транспорт на пътниците от авариралото превозно средство до избран от Вас адрес, летище или автогара.",
  },
  {
    icon: <Hammer className="h-8 w-8 text-primary" />,
    title: "Ремонти на Място",
    description: "Ако повредата на автомобила не изисква репатриране, нашият екип ще я отстрани бързо и ефективно директно на място.",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Цялостна Организация на Транспорт",
    description: "Нуждаете се от междуградски или международен превоз на автомобил, товар или техника? Осигуряваме сигурен и надежден транспорт до всяка точка в България и Европа.",
  },
];

const ServicesHighlight = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Денонощна Пътна Помощ</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Денонощна пътна помощ в Разград, България и цяла Европа. Предлагаме 24/7 репатрак услуги, смяна на гуми, подаване на ток и доставка на гориво. Бързо, надеждно и винаги на разположение!
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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