import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type MediaType = "image" | "video";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  media_type: MediaType;
  image_url: string | null;
  video_url: string | null;
  poster_url: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
};

const fallbackSlides: HeroSlide[] = [
  {
    id: "fallback-1",
    title: "",
    subtitle: null,
    description: null,
    media_type: "image",
    image_url: "/hero-1.jpg",
    video_url: null,
    poster_url: null,
    button_text: null,
    button_link: null,
    display_order: 0,
  },
  {
    id: "fallback-2",
    title: "",
    subtitle: null,
    description: null,
    media_type: "image",
    image_url: "/hero-2.jpg",
    video_url: null,
    poster_url: null,
    button_text: null,
    button_link: null,
    display_order: 1,
  },
  {
    id: "fallback-3",
    title: "",
    subtitle: null,
    description: null,
    media_type: "image",
    image_url: "/hero-4.jpg",
    video_url: null,
    poster_url: null,
    button_text: null,
    button_link: null,
    display_order: 2,
  },
];

function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const origin =
      typeof window !== "undefined"
        ? encodeURIComponent(window.location.origin)
        : encodeURIComponent("https://dscsociety.org");
    const hostname = url.hostname.toLowerCase();

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com" ||
      hostname === "www.youtube-nocookie.com"
    ) {
      const videoId = url.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
          videoId
        )}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(
          videoId
        )}&controls=0&rel=0&modestbranding=1&playsinline=1&origin=${origin}`;
      }

      if (url.pathname.startsWith("/embed/")) {
        const videoId = url.pathname.split("/embed/")[1]?.split("/")[0];

        if (videoId) {
          return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
            videoId
          )}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(
            videoId
          )}&controls=0&rel=0&modestbranding=1&playsinline=1`;
        }
      }
    }

    if (hostname === "youtu.be" || hostname === "www.youtu.be") {
      const videoId = url.pathname.replace(/^\/+/, "").split("/")[0];

      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
          videoId
        )}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(
          videoId
        )}&controls=0&rel=0&modestbranding=1&playsinline=1&origin=${origin}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function isDirectVideoUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    const pathname = url.pathname.toLowerCase();

    return (
      pathname.endsWith(".mp4") ||
      pathname.endsWith(".webm") ||
      pathname.endsWith(".ogg")
    );
  } catch {
    return false;
  }
}

const HeroSlider = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadSlides = async () => {
      const { data, error } = await supabase
        .from("homepage_slides")
        .select(
          "id,title,subtitle,description,media_type,image_url,video_url,poster_url,button_text,button_link,display_order"
        )
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!mounted) return;

      if (!error && data && data.length > 0) {
        setSlides(data as HeroSlide[]);
        setCurrent(0);
      }
    };

    loadSlides();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const currentSlide = slides[current];
    const duration =
      currentSlide?.media_type === "video" ? 15000 : 5000;

    const timer = setTimeout(() => {
      setCurrent((previous) => (previous + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [slides.length, current]);

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  const currentSlide = slides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current
              ? "z-10 opacity-100"
              : "z-0 opacity-0"
          }`}
          aria-hidden={index !== current}
        >
          {slide.media_type === "video" && slide.video_url ? (
            getYouTubeEmbedUrl(slide.video_url) ? (
              <iframe
                src={getYouTubeEmbedUrl(slide.video_url) ?? undefined}
                title={slide.title || "DSC Society hero video"}
                className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                loading={index === current ? "eager" : "lazy"}
              />
            ) : isDirectVideoUrl(slide.video_url) ? (
              <video
                src={slide.video_url}
                poster={slide.poster_url ?? undefined}
                autoPlay={index === current}
                muted
                loop
                playsInline
                preload={index === current ? "auto" : "metadata"}
                className="h-full w-full object-cover"
              />
            ) : slide.poster_url ? (
              <img
                src={slide.poster_url}
                alt={
                  slide.title ||
                  slide.subtitle ||
                  "DSC Society environmental initiative"
                }
                className="h-full w-full object-cover"
              />
            ) : null
          ) : (
            <img
              src={slide.image_url ?? ""}
              alt={
                slide.title ||
                slide.subtitle ||
                "DSC Society environmental initiative"
              }
              className={`h-full w-full object-cover transition-transform [transition-duration:5000ms] ease-out ${
                index === current ? "scale-100" : "scale-110"
              }`}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-dsc-dark/60 via-dsc-dark/40 to-dsc-dark/70" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center text-primary-foreground">
          {currentSlide?.title && (
            <h1 className="animate-[heroContentIn_800ms_ease-out_both] font-heading text-4xl font-bold md:text-6xl">
              {currentSlide.title}
            </h1>
          )}

          {currentSlide?.subtitle && (
            <p className="mt-4 animate-[heroContentIn_800ms_ease-out_150ms_both] text-lg md:text-2xl">
              {currentSlide.subtitle}
            </p>
          )}

          {currentSlide?.description && (
            <p className="mx-auto mt-4 max-w-2xl animate-[heroContentIn_800ms_ease-out_300ms_both] text-sm text-primary-foreground/90 md:text-lg">
              {currentSlide.description}
            </p>
          )}

          <div className="mt-8 flex animate-[heroContentIn_800ms_ease-out_450ms_both] flex-wrap justify-center gap-4">
            {currentSlide?.button_text && currentSlide.button_link ? (
              <Button
                asChild
                size="lg"
                className="gradient-green border-0 px-8 font-heading text-base font-semibold text-primary-foreground"
              >
                <Link to={currentSlide.button_link}>
                  {currentSlide.button_text}
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="gradient-green border-0 px-8 font-heading text-base font-semibold text-primary-foreground"
                >
                  <Link to="/join-us">Join Us</Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-primary-foreground/10 px-8 font-heading text-base font-semibold text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Link to="/focus-areas">Explore Our Work</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
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
      )}

      {/* Left Arrow */}
      {slides.length > 1 && (
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
      )}

      {/* Right Arrow */}
      {slides.length > 1 && (
        <button
          onClick={() =>
            setCurrent((previous) => (previous + 1) % slides.length)
          }
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </section>
  );
};

export default HeroSlider;
