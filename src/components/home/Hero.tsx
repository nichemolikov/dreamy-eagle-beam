import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Експертен ремонт на автомобили
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Вашите доверени механици за европейски, азиатски и местни автомобили. Качествено обслужване, на което можете да разчитате.
          </p>
          <div className="space-x-4 mt-6">
            <Button asChild size="lg">
              <Link to="/dashboard">Запазете час</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Свържете се с нас</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;