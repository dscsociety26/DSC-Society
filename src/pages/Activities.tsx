import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";

import SectionFadeIn from "@/components/SectionFadeIn";
import { supabase } from "@/lib/supabase";

type Activity = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  activity_date: string | null;
  location: string | null;
};

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("activities")
        .select(
          "id, title, slug, description, image_url, activity_date, location"
        )
        .eq("status", "published")
        .order("activity_date", {
          ascending: false,
          nullsFirst: false,
        });

      if (error) {
        console.error("Activities fetch error:", error);
        setError("Unable to load activities at the moment.");
        setActivities([]);
      } else {
        setActivities(data ?? []);
      }

      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/50 py-24">
        <div className="container-narrow text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            DSC Society
          </span>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3">
            Our{" "}
            <span className="text-gradient-green">
              Activities
            </span>
          </h1>

          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our environmental and community initiatives,
            campaigns, awareness programmes, and grassroots activities.
          </p>
        </div>
      </section>

      {/* Activities */}
      <SectionFadeIn>
        <section className="section-padding">
          <div className="container-narrow">
            {loading && (
              <div className="text-center py-16 text-muted-foreground">
                Loading activities...
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-16">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {!loading && !error && activities.length === 0 && (
              <div className="text-center py-16">
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  No activities published yet
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Published activities will appear here.
                </p>
              </div>
            )}

            {!loading && !error && activities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((activity) => (
                  <article
                    key={activity.id}
                    className="glass-card overflow-hidden rounded-2xl hover-lift group"
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {activity.image_url ? (
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="font-heading text-xl font-bold text-foreground">
                        {activity.title}
                      </h2>

                      {activity.description && (
                        <p className="text-muted-foreground mt-3 leading-relaxed line-clamp-4">
                          {activity.description}
                        </p>
                      )}

                      <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                        {activity.activity_date && (
                          <div className="flex items-center gap-2">
                            <CalendarDays
                              size={16}
                              className="text-primary shrink-0"
                            />

                            <span>
                              {new Date(
                                activity.activity_date
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {activity.location && (
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={16}
                              className="text-primary shrink-0"
                            />

                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </SectionFadeIn>
    </div>
  );
};

export default Activities;
