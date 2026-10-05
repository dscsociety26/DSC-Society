import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  activity_date: string | null;
  location: string | null;
}

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
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
        console.error("Error fetching activities:", error);
        setError("Unable to load activities.");
      } else {
        setActivities(data || []);
      }

      setLoading(false);
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-muted-foreground">
            Loading activities...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Our Activities
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Explore the initiatives and activities conducted by Dharitree
            Samrakshana Chaitanyam (DSC Society).
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-xl font-semibold">No activities available</h2>
            <p className="mt-2 text-muted-foreground">
              Published activities will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow hover:shadow-md"
              >
                {activity.image_url && (
                  <img
                    src={activity.image_url}
                    alt={activity.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-xl font-semibold">
                    {activity.title}
                  </h2>

                  {activity.activity_date && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(activity.activity_date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}

                  {activity.location && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activity.location}
                    </p>
                  )}

                  {activity.description && (
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Activities;
