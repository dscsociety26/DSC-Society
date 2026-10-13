import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AdvisoryMember = {
  id: string;
  name: string;
  slug: string;
  designation: string;
  image_url: string | null;
};

export default function AdvisoryMarquee() {
  const [members, setMembers] = useState<AdvisoryMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadMembers() {
      const { data, error } = await supabase
        .from("advisory_members")
        .select("id, name, slug, designation, image_url")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Unable to load advisory members:", error);
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

  if (loading || members.length === 0) return null;

  const scrollingMembers = [...members, ...members];

  return (
    <section className="overflow-hidden pb-7">
      <style>{`
        @keyframes advisory-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .advisory-scroll-track {
          width: max-content;
          animation: advisory-scroll 10s linear infinite;
          will-change: transform;
        }

        .advisory-scroll-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .advisory-scroll-track {
            animation: none;
          }
        }
      `}</style>

      {/* Compact scrolling strip directly below the navigation */}
      <div
        className="overflow-hidden border-y border-primary/10 bg-primary/[0.035] py-3"
        aria-label="Advisory Committee members"
      >
        <div className="advisory-scroll-track flex w-max gap-3 px-3">
          {scrollingMembers.map((member, index) => (
            <Link
              key={`${member.id}-${index}`}
              to={`/advisory-committee/${encodeURIComponent(member.slug)}`}
              aria-label={`View profile of ${member.name}, ${member.designation}`}
              tabIndex={index >= members.length ? -1 : undefined}
              className="group flex w-40 shrink-0 items-center gap-3 overflow-hidden rounded-xl border border-border/80 bg-card p-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:w-48"
            >
              <div className="h-[68px] w-[58px] shrink-0 overflow-hidden rounded-lg bg-primary/10">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-heading text-xl font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-snug text-primary">
                  {member.designation}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  View profile →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
