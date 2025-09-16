import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, BatteryCharging, CircleDot, Shield, Wind, LucideProps } from "lucide-react";
import { ElementType } from "react";

interface Service {
  Icon: ElementType<LucideProps>;
  title: string;
  description: string;
}

const allServices: Service[] = [
  { Icon: Wrench, title: "Ремонт и поддръжка на двигател", description: "Цялостна диагностика на двигателя, ремонти и настройки." },
  { Icon: CircleDot, title: "Сервиз и ремонт на спирачки", description: "Експертни прегледи на спирачки, смяна на накладки и обслужване на дискове." },
  { Icon: Car, title: "Услуги за гуми и джанти", description: "Продажба на гуми, ротация, балансиране и прецизен реглаж на колелата." },
  { Icon: BatteryCharging, title: "Електрическа диагностика", description: "Разширена диагностика за всички електрически системи на автомобила." },
  { Icon: Wrench, title: "Обслужване на трансмисия", description: "Смяна на трансмисионно масло, ремонти и пълна подмяна." },
  { Icon: Shield, title: "Профилактична поддръжка", description: "Планова поддръжка, за да поддържате автомобила си надежден." },
  { Icon: Wind, title: "Ремонт на климатик и отопление", description: "Осигурете си комфорт с нашите експертни услуги за климатичен контрол." },
  { Icon: Wrench, title: "Смяна на масло и филтри", description: "Бързи и ефективни услуги за смазване, масло и филтри." },
];

const Services = () => (
  <div>
    <section
      className="relative w-full h-[30vh] bg-cover bg-center"
      style={{ backgroundImage: "url(https://mertai.bg/wp-content/uploads/2025/09/viber_image_2025-07-29_13-43-45-541.jpg)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Нашите услуги</h1>
        <p className="max-w-[900px] md:text-xl/relaxed mt-2 text-gray-200">
          Ние предоставяме пълна гама от услуги за ремонт и поддръжка на автомобили, за да поддържате автомобила си в отлично състояние.
        </p>
      </div>
    </section>
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allServices.map(({ Icon, title, description }) => (
          <Card key={title} className="group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <Icon className="h-8 w-8 text-primary transition-colors group-hover:text-primary-foreground" />
              <CardTitle className="transition-colors group-hover:text-primary-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground/90">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);
export default Services;