import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, BatteryCharging, CircleDot, Shield, Wind } from "lucide-react";

const allServices = [
  { icon: <Wrench className="h-8 w-8 text-primary" />, title: "Engine Repair & Maintenance", description: "Comprehensive engine diagnostics, repairs, and tune-ups." },
  { icon: <CircleDot className="h-8 w-8 text-primary" />, title: "Brake Service & Repair", description: "Expert brake inspections, pad replacement, and rotor servicing." },
  { icon: <Car className="h-8 w-8 text-primary" />, title: "Tire & Wheel Services", description: "Tire sales, rotation, balancing, and precise wheel alignments." },
  { icon: <BatteryCharging className="h-8 w-8 text-primary" />, title: "Electrical Diagnostics", description: "Advanced diagnostics for all vehicle electrical systems." },
  { icon: <Wrench className="h-8 w-8 text-primary" />, title: "Transmission Services", description: "Transmission fluid changes, repairs, and full replacements." },
  { icon: <Shield className="h-8 w-8 text-primary" />, title: "Preventative Maintenance", description: "Scheduled maintenance to keep your vehicle running reliably." },
  { icon: <Wind className="h-8 w-8 text-primary" />, title: "A/C & Heating Repair", description: "Stay comfortable with our expert climate control services." },
  { icon: <Wrench className="h-8 w-8 text-primary" />, title: "Oil & Filter Change", description: "Quick and efficient lube, oil, and filter services." },
];

const Services = () => (
  <div className="container mx-auto p-4 md:p-8">
    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h1>
      <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
        We provide a comprehensive range of auto repair and maintenance services to keep your vehicle in top condition.
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