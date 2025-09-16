import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-grow p-4">
      <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
        Your Trusted Car Care Partner
      </h1>
      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
        Quality repairs, transparent pricing, and exceptional customer service. We keep you on the road.
      </p>
      <div className="mt-6 space-x-4">
        <Button asChild size="lg">
          <Link to="/dashboard">Schedule an Appointment</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/services">Our Services</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;