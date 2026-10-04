import { Link } from "react-router-dom";
import { team } from "@/data/team";
import { Button } from "@/components/ui/button";
import { TreePine, Globe, Users, Lightbulb, Leaf, HeartHandshake, Award, Target } from "lucide-react";
import SectionFadeIn from "@/components/SectionFadeIn";
import hero1 from "@/assets/hero-1.jpg";
import hero4 from "@/assets/hero-4.jpg";

const coreValues = [
  { icon: Leaf, title: "Sustainability", desc: "Living in harmony with nature" },
  { icon: Users, title: "Community", desc: "Empowering grassroots action" },
  { icon: Award, title: "Leadership", desc: "Developing youth leaders" },
  { icon: Lightbulb, title: "Innovation", desc: "Creative environmental solutions" },
];

const milestones = [
  { year: "2026", title: "DSC Society Founded", desc: "Established in Guntur, Andhra Pradesh by D.Sai Charan Gupta with a mission to combat plastic pollution." },
   { year: "2026 March", title: "Zero Plastic Campaign", desc: "The Acharya Nagarjuna University ." },

];



const About = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={hero1} alt="About" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dsc-dark/60" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">About Us</h1>
            <p className="mt-4 text-lg text-primary-foreground/80">Learn about our mission, journey, and the people behind DSC Society</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <SectionFadeIn>
        <section className="section-padding">
          <div className="container-narrow grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                Who <span className="text-gradient-green">We Are</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dharitree Samrakshana Chaitanyam (DSC) Society is a youth-driven environmental organization established in Guntur, Andhra Pradesh. We work at the grassroots level to combat plastic pollution, promote sustainable living, and empower communities.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our name, which translates to "Earth Conservation Awareness," reflects our deep commitment to protecting our planet through community engagement, education, and innovative environmental solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe that meaningful environmental change starts with youth leadership and community participation. Every campaign, every workshop, and every tree planted brings us closer to a cleaner, greener world.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden hover-lift">
              <img src={hero4} alt="DSC activities" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Mission & Vision */}
      <SectionFadeIn>
        <section className="section-padding bg-muted/50">
          <div className="container-narrow">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="glass-card p-8">
                <div className="w-14 h-14 rounded-xl gradient-green flex items-center justify-center mb-4">
                  <Target size={28} className="text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Promote sustainable living and reduce plastic pollution through youth-led action and community engagement. We strive to create awareness, implement practical solutions, and inspire the next generation of environmental stewards.
                </p>
              </div>
              <div className="glass-card p-8">
                <div className="w-14 h-14 rounded-xl gradient-green flex items-center justify-center mb-4">
                  <Globe size={28} className="text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A cleaner, greener world where communities live responsibly with nature. We envision a society where environmental consciousness is a way of life, and every individual contributes to the health of our planet.
                </p>
              </div>
            </div>

            <h3 className="text-center font-heading text-2xl font-bold text-foreground mb-8">Core Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {coreValues.map((v) => (
                <div key={v.title} className="text-center">
                  <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center mx-auto mb-3">
                    <v.icon size={28} className="text-primary-foreground" />
                  </div>
                  <h4 className="font-heading font-semibold text-foreground">{v.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Timeline */}
      <SectionFadeIn>
        <section className="section-padding">
          <div className="container-narrow">
            <h2 className="text-center font-heading text-3xl font-bold text-foreground mb-12">
              Our <span className="text-gradient-green">Journey</span>
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 md:-translate-x-px" />
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative flex items-start mb-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full gradient-green -translate-x-1/2 mt-1.5 z-10" />
                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <div className="glass-card p-6">
                      <span className="text-sm font-bold text-primary">{m.year}</span>
                      <h4 className="font-heading font-semibold text-foreground mt-1">{m.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionFadeIn>

      {/* Team */}
      <SectionFadeIn>
        <section className="section-padding bg-muted/50">
         
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  {team.map((member) => (

    <Link
      key={member.id}
      to={`/team/${member.id}`}
      aria-label={`View full profile of ${member.name}`}
      className="glass-card p-6 text-center hover-lift group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >

      {/* Profile Photograph */}

      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 gradient-green flex items-center justify-center text-primary-foreground font-heading font-bold text-3xl">

        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          member.name.charAt(0)
        )}

      </div>

      {/* Name */}

      <h4 className="font-heading font-semibold text-foreground">
        {member.name}
      </h4>

      {/* Designation */}

      <p className="text-sm text-primary font-medium mt-1">
        {member.role}
      </p>

      {/* Short Introduction */}

      <p className="text-sm text-muted-foreground mt-3">
        {member.shortBio}
      </p>

      {/* Click Indicator */}

      <span className="inline-block text-sm font-semibold text-primary mt-5 group-hover:underline">
        View Full Profile →
      </span>

    </Link>

  ))}

</div>

        </section>
      </SectionFadeIn>
    </div>
  );
};

export default About;
