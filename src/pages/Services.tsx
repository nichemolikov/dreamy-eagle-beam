import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, BatteryCharging, CircleDot, Shield, Wind } from "lucide-react";

const allServices = [
  { icon: <Wrench className="h-8 w-8 text-primary" />, title: "Ремонт и поддръжка на двигател", description: "Цялостна диагностика на двигателя, ремонти и настройки." },
  { icon: <CircleDot className="h-8 w-8 text-primary" />, title: "Сервиз и ремонт на спирачки", description: "Експертни прегледи на спирачки, смяна на накладки и обслужване на дискове." },
  { icon: <Car className="h-8 w-8 text-primary" />, title: "Услуги за гуми и джанти", description: "Продажба на гуми, ротация, балансиране и прецизен реглаж на колелата." },
  { icon: <BatteryCharging className="h-8 w-8 text-primary" />, title: "Електрическа диагностика", description: "Разширена диагностика за всички електрически системи на автомобила." },
  { icon: <Wrench className="h-8 w-8 text-primary" />, title: "Обслужване на трансмисия", description: "Смяна на трансмисионно масло, ремонти и пълна подмяна." },
  { icon: <Shield className="h-8 w-8 text-primary" />, title: "Профилактична поддръжка", description: "Планова поддръжка, за да поддържате автомобила си надежден." },
  { icon: <Wind className="h-8 w-8 text-primary" />, title: "Ремонт на климатик и отопление", description: "Осигурете си комфорт с нашите експертни услуги за климатичен контрол." },
  { icon: <Wrench className="h-8 w-8 text-primary" />, title: "Смяна на масло и филтри", description: "Бързи и ефективни услуги за смазване, масло и филтри." },
];

const Services = () => (
  <div className="container mx-auto p-4 md:p-8">
    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Нашите услуги</h1>
      <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
        Ние предоставяме пълна гама от услуги за ремонт и поддръжка на автомобили, за да поддържате автомобила си в отлично състояние.
      </p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {allServices.map((service) => (
        <Card key={service.title}>
          <CardHeader className="flex flex-row items-center gap-4">
            {service.icon}
            <CardTitle>{service.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
export default Services;