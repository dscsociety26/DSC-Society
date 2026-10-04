import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Recycle, Users, Heart, TreePine, Lightbulb, Award, HandHeart } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionFadeIn from "@/components/SectionFadeIn";
import clean12 from "@/assets/clean12.jpeg";
import plant8 from "@/assets/plant8.jpeg";
import hero4 from "@/assets/hero-4.jpg";
import plant1 from "@/assets/plant1.jpeg";
import plant3 from "@/assets/plant3.jpeg";
import plant8 from "@/assets/plant8.jpeg";
import cloth1 from "@/assets/cloth1.jpeg";
import cloth2 from "@/assets/cloth2.jpeg";
import cloth3 from "@/assets/cloth3.jpeg";
import clean12 from "@/assets/clean12.jpeg";

const focusAreas = [
  { icon: Shield, title: "Environmental Protection", desc: "Tree plantation, eco-awareness and nature conservation campaigns." },
  { icon: Recycle, title: "Waste Management", desc: "Plastic reduction, recycling awareness and waste-to-resource innovation." },
  { icon: Lightbulb, title: "Skill Development", desc: "Training youth, environmental leadership programs and workshops." },
  { icon: Heart, title: "Health & Sanitation", desc: "Clean environment, community hygiene and public sanitation initiatives." },
];

const stats = [
  { end: 3500, suffix: "+", label: "Students Engaged" },
  { end: 40, suffix: "+", label: "Communities Reached" },
  { end: 2500, suffix: " +", label: "Beneficiaries" },
  { end: 800, suffix: "+", label: "Volunteers" },
];

const galleryImages = [clean12,plant1, plant8, cloth1, cloth2, cloth3];

const Index = () => {
  return (
    <div>
      <HeroSlider />

      {/* About Preview */}
      <SectionFadeIn>
        <section className="section-padding">
          <div className="container-narrow text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              About <span className="text-gradient-green">DSC Society</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dharitree Samrakshana Chaitanyam (DSC) Society is a youth-driven environmental organization dedicated to fighting plastic pollution, promoting sustainability, and empowering communities across India. Through grassroots initiatives, awareness campaigns, and skill development programs, we are building a cleaner, greener future.
            </p>
            <Button asChild variant="outline" className="mt-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </section>
      </SectionFadeIn>

      {/* Focus Areas */}
      <SectionFadeIn>
        <section className="section-padding bg-muted/50">
          <div className="container-narrow">
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">
              Our <span className="text-gradient-green">Focus Areas</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {focusAreas.map((area) => (
                <div key={area.title} className="glass-card p-6 hover-lift cursor-pointer group">
                  <div className="w-14 h-14 rounded-xl gradient-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <area.icon size={28} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{area.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Impact */}
      <SectionFadeIn>
        <section className="section-padding gradient-green">
          <div className="container-narrow">
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-12">
              Our Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <AnimatedCounter key={s.label} end={s.end} suffix={s.suffix} label={s.label} />
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Gallery Preview */}
      <SectionFadeIn>
        <section className="section-padding">
          <div className="container-narrow">
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">
              <span className="text-gradient-green">Gallery</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl hover-lift">
                  <img src={img} alt="Activity" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading">
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Join Us */}
      <SectionFadeIn>
        <section className="section-padding bg-muted/50">
          <div className="container-narrow">
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">
              Join <span className="text-gradient-green">Our Mission</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: HandHeart, title: "Volunteer", desc: "Join DSC as a volunteer and participate in environmental campaigns, awareness programs, and community initiatives." },
                { icon: Award, title: "Internship", desc: "Gain hands-on experience in environmental projects, community engagement, and sustainability initiatives." },
              ].map((card) => (
                <div key={card.title} className="glass-card p-8 hover-lift text-center">
                  <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center mx-auto mb-4">
                    <card.icon size={32} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{card.title}</h3>
                  <p className="text-muted-foreground mb-6">{card.desc}</p>
                  <Button asChild className="gradient-green border-0 text-primary-foreground font-heading">
                    <Link to="/join-us">Apply Now</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>
    </div>
  );
};

export default Index;
