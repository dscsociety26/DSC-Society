import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SectionFadeIn from "@/components/SectionFadeIn";

type AdvisoryMember = {
  id: string;
  name: string;
  designation: string;
  short_bio: string | null;
  image_url: string | null;
  display_order: number;
};

export default function AdvisoryCommittee() {
  const [members, setMembers] = useState<AdvisoryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMembers() {
      const { data, error } = await supabase
        .from("advisory_members")
        .select("id, name, designation, short_bio, image_url, display_order")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Failed to load advisory committee:", error);
        setError("Unable to load the Advisory Committee at the moment.");
      } else {
        setMembers(data ?? []);
      }

      setLoading(false);
    }

    void loadMembers();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="container-narrow">
          <Link
            to="/about"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to About Us
          </Link>

          <SectionFadeIn>
            <header className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users size={28} />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Guidance and Experience
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-5xl">
                Our Advisory Committee
              </h1>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                Meet the experienced individuals who guide and support our
                mission, initiatives, and community impact.
              </p>
            </header>
          </SectionFadeIn>

          {loading ? (
            <p className="py-16 text-center text-muted-foreground">
              Loading Advisory Committee...
            </p>
          ) : error ? (
            <p role="alert" className="py-16 text-center text-muted-foreground">
              {error}
            </p>
          ) : members.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              Advisory Committee details will be available soon.
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="glass-card rounded-2xl p-6 text-center"
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
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
