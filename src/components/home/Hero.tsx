import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Експертен ремонт на автомобили
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
              Вашите доверени механици за европейски, азиатски и местни автомобили. Качествено обслужване, на което можете да разчитате.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link to="/dashboard">Запазете час</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Свържете се с нас</Link>
              </Button>
            </div>
          </div>
          <img
            alt="Автомобил в сервиз"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
            src="/placeholder.svg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;