import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="relative w-full h-[70vh] max-h-[800px] flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url(/placeholder.svg)" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container px-4 md:px-6 text-white">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Експертен ремонт на автомобили
          </h1>
          <p className="mx-auto max-w-[700px] md:text-xl">
            Вашите доверени механици за европейски, азиатски и местни автомобили. Качествено обслужване, на което можете да разчитате.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
            <Button asChild size="lg">
              <Link to="/dashboard">Запазете час</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/contact">Свържете се с нас</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;