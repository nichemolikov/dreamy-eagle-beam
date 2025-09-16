import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Expert Auto Repair in Toronto
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Your trusted mechanics for European, Asian, and Domestic vehicles. Quality service you can rely on.
          </p>
          <div className="space-x-4 mt-6">
            <Button asChild size="lg">
              <Link to="/dashboard">Book an Appointment</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;