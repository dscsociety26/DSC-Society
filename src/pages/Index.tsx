import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

import {
  Shield,
  Recycle,
  Heart,
  Lightbulb,
  Award,
  HandHeart,
} from "lucide-react";

import HeroSlider from "@/components/HeroSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionFadeIn from "@/components/SectionFadeIn";

// Focus Areas
const focusAreas = [
  {
    icon: Shield,
    title: "Environmental Protection",
    desc: "Tree plantation, eco-awareness and nature conservation campaigns.",
  },
  {
    icon: Recycle,
    title: "Waste Management",
    desc: "Plastic reduction, recycling awareness and waste-to-resource innovation.",
  },
  {
    icon: Lightbulb,
    title: "Skill Development",
    desc: "Training youth, environmental leadership programs and workshops.",
  },
  {
    icon: Heart,
    title: "Health & Sanitation",
    desc: "Clean environment, community hygiene and public sanitation initiatives.",
  },
];

// Impact Statistics
const stats = [
  { end: 3500, suffix: "+", label: "Students Engaged" },
  { end: 40, suffix: "+", label: "Communities Reached" },
  { end: 2500, suffix: "+", label: "Beneficiaries" },
  { end: 800, suffix: "+", label: "Volunteers" },
];

type GalleryPreviewItem = {
  id: string;
  title: string;
  image_url: string;
  caption: string | null;
};

// Join Us Cards
const joinCards = [
  {
    icon: HandHeart,
    title: "Volunteer",
    desc: "Join DSC as a volunteer and participate in environmental campaigns, awareness programs, and community initiatives.",
  },
  {
    icon: Award,
    title: "Internship",
    desc: "Gain hands-on experience in environmental projects, community engagement, and sustainability initiatives.",
  },
];

const Index = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryPreviewItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const loadGalleryPreview = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, title, image_url, caption")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Failed to load homepage gallery:", error);
        setGalleryImages([]);
      } else {
        setGalleryImages((data ?? []) as GalleryPreviewItem[]);
      }

      setGalleryLoading(false);
    };

    void loadGalleryPreview();
  }, []);

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <HeroSlider />

      {/* About Preview */}
      <SectionFadeIn>
        <section
          className="section-padding"
          aria-labelledby="about-heading"
        >
          <div className="container-narrow text-center">
            <h2
              id="about-heading"
              className="font-heading text-3xl md:text-4xl font-bold text-foreground"
            >
              About{" "}
              <span className="text-gradient-green">
                DSC Society
              </span>
            </h2>

            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dharitree Samrakshana Chaitanyam (DSC) Society is a
              youth-driven environmental organization dedicated to
              fighting plastic pollution, promoting sustainability,
              and empowering communities across India. Through
              grassroots initiatives, awareness campaigns, and skill
              development programs, we are building a cleaner,
              greener future.
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </section>
      </SectionFadeIn>

      {/* Focus Areas */}
      <SectionFadeIn>
        <section
          className="section-padding bg-muted/50"
          aria-labelledby="focus-heading"
        >
          <div className="container-narrow">
            <h2
              id="focus-heading"
              className="text-center font-heading text-3xl md:text-4xl font-bold text-foreground mb-12"
            >
              Our{" "}
              <span className="text-gradient-green">
                Focus Areas
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {focusAreas.map((area) => (
                <article
                  key={area.title}
                  className="glass-card p-6 hover-lift group"
                >
                  <div className="w-14 h-14 rounded-xl gradient-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <area.icon
                      size={28}
                      aria-hidden="true"
                      className="text-primary-foreground"
                    />
                  </div>

                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {area.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {area.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Impact */}
      <SectionFadeIn>
        <section
          className="section-padding gradient-green"
          aria-labelledby="impact-heading"
        >
          <div className="container-narrow">
            <h2
              id="impact-heading"
              className="text-center font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-12"
            >
              Our Impact
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <AnimatedCounter
                  key={stat.label}
                  end={stat.end}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Gallery Preview */}
      <SectionFadeIn>
        <section
          className="section-padding"
          aria-labelledby="gallery-heading"
        >
          <div className="container-narrow">
            <h2
              id="gallery-heading"
              className="text-center font-heading text-3xl md:text-4xl font-bold text-foreground mb-12"
            >
              <span className="text-gradient-green">
                Gallery
              </span>
            </h2>

            {galleryLoading ? (
              <div className="py-12 text-center text-muted-foreground">
                Loading gallery...
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Gallery images will appear here soon.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-[4/3] overflow-hidden rounded-xl hover-lift bg-muted"
                  >
                    <img
                      src={image.image_url}
                      alt={
                        image.caption ||
                        image.title ||
                        "DSC Society Gallery"
                      }
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading"
              >
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Join Us */}
      <SectionFadeIn>
        <section
          className="section-padding bg-muted/50"
          aria-labelledby="join-heading"
        >
          <div className="container-narrow">
            <h2
              id="join-heading"
              className="text-center font-heading text-3xl md:text-4xl font-bold text-foreground mb-12"
            >
              Join{" "}
              <span className="text-gradient-green">
                Our Mission
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {joinCards.map((card) => (
                <article
                  key={card.title}
                  className="glass-card p-8 hover-lift text-center"
                >
                  <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center mx-auto mb-4">
                    <card.icon
                      size={32}
                      aria-hidden="true"
                      className="text-primary-foreground"
                    />
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                    {card.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {card.desc}
                  </p>

                  <Button
                    asChild
                    className="gradient-green border-0 text-primary-foreground font-heading"
                  >
                    <Link to="/join-us">Apply Now</Link>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>
    </main>
  );
};

export default Index;
