import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventStatus = "published" | "completed" | "cancelled";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  venue: string | null;
  image_url: string | null;
  status: EventStatus;
}

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, title, description, event_date, venue, image_url, status"
        )
        .eq("status", "published")
        .order("event_date", {
          ascending: true,
        });

      if (error) {
        console.error("Error fetching events:", error);
        setError("Unable to load events.");
      } else {
        setEvents(data || []);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-muted-foreground">
            Loading events...
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
            Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Stay updated with upcoming events and initiatives conducted by
            Dharitree Samrakshana Chaitanyam (DSC Society).
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-xl font-semibold">
              No events available
            </h2>

            <p className="mt-2 text-muted-foreground">
              Published events will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow hover:shadow-md"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-xl font-semibold">
                    {event.title}
                  </h2>

                  {event.event_date && (
                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}

                  {event.venue && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.venue}
                    </p>
                  )}

                  {event.description && (
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {event.description}
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

export default Events;
