import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import cloth1 from "@/assets/cloth1.jpeg";
import plant1 from "@/assets/plant1.jpeg";
import clean1 from "@/assets/clean1.jpeg";
import clean5 from "@/assets/clean5.jpeg";
import cloth3 from "@/assets/cloth3.jpeg";

const slides = [cloth1, plant1, clean1, clean5, cloth3];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((previous) => (previous + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current
              ? "z-10 opacity-100"
              : "z-0 opacity-0"
          }`}
          aria-hidden={index !== current}
        >
          <img
            src={slide}
            alt="DSC Society environmental initiative"
            className={`h-full w-full object-cover transition-transform [transition-duration:5000ms] ease-out ${
              index === current ? "scale-100" : "scale-110"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-dsc-dark/60 via-dsc-dark/40 to-dsc-dark/70" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mt-8 flex animate-[heroContentIn_800ms_ease-out_900ms_both] flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="gradient-green border-0 text-primary-foreground font-heading font-semibold text-base px-8"
            >
              <Link to="/join-us">Join Us</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 font-heading font-semibold text-base px-8"
            >
              <Link to="/focus-areas">Explore Our Work</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current ? "true" : undefined}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-primary-foreground"
                : "w-3 bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={() =>
          setCurrent(
            (previous) => (previous - 1 + slides.length) % slides.length
          )
        }
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() =>
          setCurrent((previous) => (previous + 1) % slides.length)
        }
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
};

export default HeroSlider;
