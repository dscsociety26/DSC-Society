
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Globe,
  Users,
  Lightbulb,
  Leaf,
  Award,
  Target,
} from "lucide-react";

import SectionFadeIn from "@/components/SectionFadeIn";
import { supabase } from "@/lib/supabase";

import hero1 from "@/assets/hero-1.jpg";
import hero4 from "@/assets/hero-4.jpg";

// Core Values

const coreValues = [
  {
    icon: Leaf,
    title: "Sustainability",
    desc: "Living in harmony with nature",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Empowering grassroots action",
  },
  {
    icon: Award,
    title: "Leadership",
    desc: "Developing youth leaders",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Creative environmental solutions",
  },
];

// Organizational Journey

const milestones = [
  {
    year: "2026",
    title: "DSC Society Founded",
    desc: "Established in Guntur, Andhra Pradesh, by D. Sai Charan Gupta with a mission to combat plastic pollution and promote environmental conservation.",
  },
  {
    year: "March 2026",
    title: "Zero Plastic Campaign",
    desc: "Initiative to promote plastic reduction, environmental awareness, and responsible waste management among students and communities.",
  },
];

// About Page

type TeamMember = {
  id: string;
  name: string;
  slug: string;
  designation: string;
  short_bio: string | null;
  image_url: string | null;
  display_order: number;
  status: "draft" | "published";
};

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      setTeamLoading(true);
      setTeamError("");

      const { data, error } = await supabase
        .from("team_members")
        .select(
          "id, name, slug, designation, short_bio, image_url, display_order, status"
        )
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load team:", error);
        setTeamError("Unable to load our team at the moment.");
        setTeamMembers([]);
      } else {
        setTeamMembers(data ?? []);
      }

      setTeamLoading(false);
    };

    loadTeam();
  }, []);

  return (
    <div className="pt-20">

      {/* HERO SECTION */}

      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">

        <img
          src={hero1}
          alt="DSC Society environmental activities"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-dsc-dark/60" />

        <div className="relative z-10 flex h-full items-center justify-center px-4">

          <div className="text-center">

            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              About Us
            </h1>

            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Learn about our mission, journey, and the people behind DSC Society.
            </p>

          </div>

        </div>
      </section>

      {/* INTRODUCTION */}

      <SectionFadeIn>

        <section className="section-padding">

          <div className="container-narrow grid md:grid-cols-2 gap-12 items-center">

            <div>

              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                Who{" "}
                <span className="text-gradient-green">
                  We Are
                </span>
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

              <img
                src={hero4}
                alt="DSC Society community activities"
                loading="lazy"
                className="w-full h-full object-cover"
              />

            </div>

          </div>

        </section>

      </SectionFadeIn>

      {/* MISSION AND VISION */}

      <SectionFadeIn>

        <section className="section-padding bg-muted/50">

          <div className="container-narrow">

            <div className="grid md:grid-cols-2 gap-8 mb-16">

              {/* MISSION */}

              <div className="glass-card p-8">

                <div className="w-14 h-14 rounded-xl gradient-green flex items-center justify-center mb-4">

                  <Target
                    size={28}
                    className="text-primary-foreground"
                  />

                </div>

                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  Promote sustainable living and reduce plastic pollution through youth-led action and community engagement. We strive to create awareness, implement practical solutions, and inspire the next generation of environmental stewards.
                </p>

              </div>

              {/* VISION */}

              <div className="glass-card p-8">

                <div className="w-14 h-14 rounded-xl gradient-green flex items-center justify-center mb-4">

                  <Globe
                    size={28}
                    className="text-primary-foreground"
                  />

                </div>

                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  A cleaner, greener world where communities live responsibly with nature. We envision a society where environmental consciousness is a way of life, and every individual contributes to the health of our planet.
                </p>

              </div>

            </div>

            {/* CORE VALUES */}

            <h3 className="text-center font-heading text-2xl font-bold text-foreground mb-8">
              Core Values
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {coreValues.map((value) => {

                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="text-center"
                  >

                    <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center mx-auto mb-3">

                      <Icon
                        size={28}
                        className="text-primary-foreground"
                      />

                    </div>

                    <h4 className="font-heading font-semibold text-foreground">
                      {value.title}
                    </h4>

                    <p className="text-sm text-muted-foreground mt-1">
                      {value.desc}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

      </SectionFadeIn>

      {/* ORGANIZATIONAL JOURNEY */}

      <SectionFadeIn>

        <section className="section-padding">

          <div className="container-narrow">

            <h2 className="text-center font-heading text-3xl font-bold text-foreground mb-12">

              Our{" "}
              <span className="text-gradient-green">
                Journey
              </span>

            </h2>

            <div className="relative max-w-2xl mx-auto">

              {/* Timeline Line */}

              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 md:-translate-x-px" />

              {milestones.map((milestone, index) => (

                <div
                  key={`${milestone.year}-${milestone.title}`}
                  className={`relative flex items-start mb-12 ${
                    index % 2 === 0
                      ? "md:flex-row-reverse"
                      : ""
                  }`}
                >

                  {/* Timeline Dot */}

                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full gradient-green -translate-x-1/2 mt-1.5 z-10" />

                  {/* Timeline Content */}

                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0
                        ? "md:mr-auto md:pr-8"
                        : "md:ml-auto md:pl-8"
                    }`}
                  >

                    <div className="glass-card p-6">

                      <span className="text-sm font-bold text-primary">
                        {milestone.year}
                      </span>

                      <h4 className="font-heading font-semibold text-foreground mt-1">
                        {milestone.title}
                      </h4>

                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {milestone.desc}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

      </SectionFadeIn>

      {/* OUR TEAM */}

      <SectionFadeIn>

        <section className="section-padding bg-muted/50">

          <div className="container-narrow">

            {/* Team Heading */}

            <div className="text-center mb-12">

              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                The People Behind Our Mission
              </span>

              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3">

                Meet Our{" "}
                <span className="text-gradient-green">
                  Team
                </span>

              </h2>

              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
                Dedicated individuals working together to protect nature, promote sustainability, and create meaningful community impact.
              </p>

            </div>

            {/* Team Cards */}

            {teamLoading ? (

              <div className="text-center py-12 text-muted-foreground">
                Loading our team...
              </div>

            ) : teamError ? (

              <div className="text-center py-12 text-muted-foreground">
                {teamError}
              </div>

            ) : teamMembers.length === 0 ? (

              <div className="text-center py-12 text-muted-foreground">
                Our team information is currently unavailable.
              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {teamMembers.map((member) => (

                  <Link
                    key={member.id}
                    to={`/team/${member.slug}`}
                    aria-label={`View full profile of ${member.name}`}
                    className="glass-card p-6 text-center hover-lift group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >

                    {/* Profile Photograph */}

                    <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-5 gradient-green flex items-center justify-center text-primary-foreground font-heading font-bold text-3xl shadow-md">

                      {member.image_url ? (

                        <img
                          src={member.image_url}
                          alt={member.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        member.name.charAt(0)

                      )}

                    </div>

                    {/* Member Name */}

                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>

                    {/* Designation */}

                    <p className="text-sm text-primary font-medium mt-2">
                      {member.designation}
                    </p>

                    {/* Short Biography */}

                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                      {member.short_bio}
                    </p>

                    {/* Profile Link */}

                    <div className="mt-5 pt-4 border-t border-border/50">

                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline">

                        View Full Profile

                        <span aria-hidden="true">
                          →
                        </span>

                      </span>

                    </div>

                  </Link>

                ))}

              </div>

            )}

          </div>

        </section>

      </SectionFadeIn>

    </div>
  );
};

export default About;
