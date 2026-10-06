import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  CalendarDays,
  Users,
  Image,
  ClipboardList,
  MessageSquare,
  Loader2,
  ShieldCheck,
  Plus,
  ArrowRight,
  Bell,
  Mail,
  Clock,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardCounts = {
  activities: number;
  activitiesPublished: number;
  activitiesDraft: number;
  events: number;
  eventsPublished: number;
  eventsUpcoming: number;
  team: number;
  teamPublished: number;
  gallery: number;
  galleryPublished: number;
  volunteers: number;
  volunteersNew: number;
  messages: number;
  messagesUnread: number;
};

const initialCounts: DashboardCounts = {
  activities: 0,
  activitiesPublished: 0,
  activitiesDraft: 0,
  events: 0,
  eventsPublished: 0,
  eventsUpcoming: 0,
  team: 0,
  teamPublished: 0,
  gallery: 0,
  galleryPublished: 0,
  volunteers: 0,
  volunteersNew: 0,
  messages: 0,
  messagesUnread: 0,
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [error, setError] = useState("");
  const [counts, setCounts] = useState(initialCounts);

  useEffect(() => {
    let active = true;

    const verifyAdmin = async () => {
      try {
        const { data, error: authError } =
          await supabase.auth.getUser();

        if (authError || !data.user) {
          navigate("/admin", { replace: true });
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("admin_profiles")
            .select("role")
            .eq("user_id", data.user.id)
            .maybeSingle();

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          navigate("/admin", { replace: true });
          return;
        }

        if (!active) return;

        setAdminEmail(data.user.email ?? "");

        const [
          activitiesResult,
          eventsResult,
          teamResult,
          galleryResult,
          volunteersResult,
          messagesResult,
        ] = await Promise.all([
          supabase
            .from("activities")
            .select("status", { count: "exact" }),

          supabase
            .from("events")
            .select("status, event_date", { count: "exact" }),

          supabase
            .from("team_members")
            .select("status", { count: "exact" }),

          supabase
            .from("gallery")
            .select("status", { count: "exact" }),

          supabase
            .from("volunteer_registrations")
            .select("status", { count: "exact" }),

          supabase
            .from("contact_submissions")
            .select("status", { count: "exact" }),
        ]);

        if (!active) return;

        const results = [
          activitiesResult,
          eventsResult,
          teamResult,
          galleryResult,
          volunteersResult,
          messagesResult,
        ];

        if (results.some((result) => result.error)) {
          setError(
            "Some dashboard statistics could not be loaded. Please check your Supabase permissions."
          );
        }

        const activities = activitiesResult.data ?? [];
        const events = eventsResult.data ?? [];
        const team = teamResult.data ?? [];
        const gallery = galleryResult.data ?? [];
        const volunteers = volunteersResult.data ?? [];
        const messages = messagesResult.data ?? [];

        const now = new Date();

        setCounts({
          activities: activitiesResult.count ?? 0,
          activitiesPublished: activities.filter(
            (item) => item.status === "published"
          ).length,
          activitiesDraft: activities.filter(
            (item) => item.status === "draft"
          ).length,

          events: eventsResult.count ?? 0,
          eventsPublished: events.filter(
            (item) => item.status === "published"
          ).length,
          eventsUpcoming: events.filter(
            (item) =>
              item.event_date &&
              new Date(item.event_date) >= now
          ).length,

          team: teamResult.count ?? 0,
          teamPublished: team.filter(
            (item) => item.status === "published"
          ).length,

          gallery: galleryResult.count ?? 0,
          galleryPublished: gallery.filter(
            (item) => item.status === "published"
          ).length,

          volunteers: volunteersResult.count ?? 0,
          volunteersNew: volunteers.filter(
            (item) => item.status === "new"
          ).length,

          messages: messagesResult.count ?? 0,
          messagesUnread: messages.filter(
            (item) => item.status === "unread"
          ).length,
        });
      } catch (err) {
        console.error("Dashboard error:", err);

        if (active) {
          setError("Unable to verify the admin session.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void verifyAdmin();

    return () => {
      active = false;
    };
  }, [navigate]);

  const overviewCards = [
    {
      title: "Activities",
      count: counts.activities,
      secondary: `${counts.activitiesPublished} published`,
      icon: Leaf,
      route: "/admin/activities",
    },
    {
      title: "Events",
      count: counts.events,
      secondary: `${counts.eventsUpcoming} upcoming`,
      icon: CalendarDays,
      route: "/admin/events",
    },
    {
      title: "Team Members",
      count: counts.team,
      secondary: `${counts.teamPublished} published`,
      icon: Users,
      route: "/admin/team",
    },
    {
      title: "Gallery",
      count: counts.gallery,
      secondary: `${counts.galleryPublished} published`,
      icon: Image,
      route: "/admin/gallery",
    },
    {
      title: "Volunteers",
      count: counts.volunteers,
      secondary: `${counts.volunteersNew} new`,
      icon: ClipboardList,
      route: "/admin/volunteers",
    },
    {
      title: "Messages",
      count: counts.messages,
      secondary: `${counts.messagesUnread} unread`,
      icon: MessageSquare,
      route: "/admin/contacts",
    },
  ];



  if (loading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-muted/30">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verifying administrator access...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage Dharitree Samrakshana Chaitanyam's activities,
              events, team, gallery, volunteers and messages from one
              place.
            </p>
          </div>

        </header>

        {/* Admin identity */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Signed in as
              </p>

              <p className="mt-1 truncate font-medium text-slate-900">
                {adminEmail}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
              Authorized Administrator
            </div>
          </CardContent>
        </Card>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {/* Overview */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              Content Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Current records and publishing status across the website.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => navigate(card.route)}
                  className="text-left"
                >
                  <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>

                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                      <div className="text-3xl font-bold">
                        {card.count}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {card.secondary}
                        </p>

                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        </section>

        {/* Attention */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              Attention Required
            </h2>
            <p className="text-sm text-muted-foreground">
              Items that may need administrator attention.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/admin/volunteers")}
              className="group text-left"
            >
              <Card className="h-full border-slate-200 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-emerald-200 group-hover:shadow-md group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-emerald-500">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <Bell className="h-5 w-5" />
                  </div>

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {counts.volunteersNew}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        New volunteer registrations
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/contacts")}
              className="group text-left"
            >
              <Card className="h-full border-slate-200 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-emerald-200 group-hover:shadow-md group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-emerald-500">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {counts.messagesUnread}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Unread contact messages
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="group text-left"
            >
              <Card className="h-full border-slate-200 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-emerald-200 group-hover:shadow-md group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-emerald-500">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <Clock className="h-5 w-5" />
                  </div>

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {counts.eventsUpcoming}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upcoming events
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </button>
          </div>
        </section>


      </div>
    </main>
  );
};

export default AdminDashboard;
