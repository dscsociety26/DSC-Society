import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AdvisoryMember = {
  name: string;
  slug: string;
  designation: string;
  short_bio: string | null;
  bio: string | null;
  origin: string | null;
  interests: string[] | null;
  image_url: string | null;
};

export default function AdvisoryMemberProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<AdvisoryMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMember() {
      setLoading(true);
      setError(false);
      setMember(null);

      const { data, error: queryError } = await supabase
        .from("advisory_members")
        .select(
          "name, slug, designation, short_bio, bio, origin, interests, image_url"
        )
        .eq("slug", slug ?? "")
        .eq("status", "published")
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        console.error("Unable to load advisory profile:", queryError);
        setError(true);
      } else {
        setMember(data);
      }

      setLoading(false);
    }

    void loadMember();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <section className="container-narrow px-4">
        <Link
          to="/advisory-committee"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Advisory Committee
        </Link>

        {loading ? (
          <p className="py-20 text-center text-muted-foreground">
            Loading advisory profile...
          </p>
        ) : error ? (
          <p role="alert" className="py-20 text-center text-muted-foreground">
            Unable to load this profile. Please try again later.
          </p>
        ) : !member ? (
          <div className="py-20 text-center">
            <h1 className="font-heading text-2xl font-bold">
              Advisory member not found
            </h1>
            <p className="mt-3 text-muted-foreground">
              This profile may be unpublished or no longer available.
            </p>
            <Link
              to="/advisory-committee"
              className="mt-5 inline-flex items-center gap-2 text-primary hover:underline"
            >
              View Advisory Committee <ArrowLeft size={16} />
            </Link>
          </div>
        ) : (
          <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid md:grid-cols-[minmax(240px,0.8fr)_1.2fr]">
              <div className="flex min-h-72 items-center justify-center bg-muted md:min-h-full">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="h-full max-h-[520px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-72 w-full items-center justify-center bg-primary/10 font-heading text-8xl font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-10">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users size={23} />
                </div>

                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Advisory Committee
                </p>

                <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  {member.name}
                </h1>

                <p className="mt-3 text-lg font-medium text-primary">
                  {member.designation}
                </p>

                {member.origin && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {member.origin}
                  </p>
                )}

                {member.short_bio && (
                  <p className="mt-6 leading-relaxed text-muted-foreground">
                    {member.short_bio}
                  </p>
                )}

                {member.bio && (
                  <div className="mt-6 whitespace-pre-line leading-7 text-foreground/90">
                    {member.bio}
                  </div>
                )}

                {member.interests && member.interests.length > 0 && (
                  <div className="mt-7">
                    <h2 className="font-heading text-lg font-semibold">
                      Interests and Focus Areas
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to="/advisory-committee"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <ArrowLeft size={16} />
                  Meet the full committee
                </Link>
              </div>
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
