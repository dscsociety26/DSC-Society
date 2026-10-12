import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";

import { supabase } from "@/lib/supabase";
import SectionFadeIn from "@/components/SectionFadeIn";
import { Button } from "@/components/ui/button";

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

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("team_members")
        .select(
          "id, name, slug, designation, short_bio, image_url, display_order, status"
        )
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load team:", error);
        setError("Unable to load our team at the moment. Please try again later.");
        setTeamMembers([]);
      } else {
        setTeamMembers(data ?? []);
      }

      setLoading(false);
    };

    loadTeam();
  }, []);

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="container-narrow">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/about">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to About Us
            </Link>
          </Button>

          <SectionFadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users size={28} />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                The People Behind Our Mission
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-5xl">
                Meet Our Team
              </h1>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                Meet the dedicated individuals working together to protect nature,
                promote sustainability, and create meaningful community impact.
              </p>
            </div>
          </SectionFadeIn>

          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              Loading our team...
            </div>
          ) : error ? (
            <div role="alert" className="py-16 text-center text-muted-foreground">
              {error}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              Our team information is currently unavailable.
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <Link
                  key={member.id}
                  to={`/team/${member.slug}`}
                  aria-label={`View full profile of ${member.name}`}
                  className="glass-card group block rounded-2xl p-6 text-center hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary font-heading text-3xl font-bold text-primary-foreground shadow-md">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    {member.name}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-primary">
                    {member.designation}
                  </p>
                  {member.short_bio && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {member.short_bio}
                    </p>
                  )}
                  <div className="mt-5 border-t border-border/50 pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline">
                      View Full Profile <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Team;
