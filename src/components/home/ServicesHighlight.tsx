import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, BatteryCharging, CircleDot } from "lucide-react";

const services = [
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Engine & Transmission",
    description: "Comprehensive engine diagnostics, repairs, and transmission services to keep your car running smoothly.",
  },
  {
    icon: <CircleDot className="h-8 w-8 text-primary" />,
    title: "Brake Services",
    description: "Expert brake inspections, repairs, and replacements for your safety and peace of mind on the road.",
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: "Tire & Alignment",
    description: "Professional tire services, including rotation, balancing, and precise wheel alignments.",
  },
  {
    icon: <BatteryCharging className="h-8 w-8 text-primary" />,
    title: "Electrical Diagnostics",
    description: "Advanced diagnostics to pinpoint and resolve any electrical issues in your vehicle.",
  },
];

const ServicesHighlight = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Most Popular Services</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We offer a wide range of services to meet all your auto repair needs.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader className="flex flex-col items-center text-center">
                {service.icon}
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlight;