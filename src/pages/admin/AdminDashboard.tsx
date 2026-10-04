
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  CalendarDays,
  Users,
  Image,
  ClipboardList,
  MessageSquare,
  LogOut,
  Loader2,
  ShieldCheck,
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
  team: number;
  events: number;
  gallery: number;
  volunteers: number;
  messages: number;
};

const initialCounts: DashboardCounts = {
  activities: 0,
  team: 0,
  events: 0,
  gallery: 0,
  volunteers: 0,
  messages: 0,
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
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

        const tables = [
          "activities",
          "team_members",
          "events",
          "gallery",
          "volunteer_registrations",
          "contact_submissions",
        ] as const;

        const results = await Promise.all(
          tables.map((table) =>
            supabase.from(table).select("*", {
              count: "exact",
              head: true,
            })
          )
        );

        if (!active) return;

        const failed = results.find((result) => result.error);

        if (failed) {
          setError(
            "Some dashboard statistics could not be loaded. Check your Supabase table permissions."
          );
        }

        setCounts({
          activities: results[0].count ?? 0,
          team: results[1].count ?? 0,
          events: results[2].count ?? 0,
          gallery: results[3].count ?? 0,
          volunteers: results[4].count ?? 0,
          messages: results[5].count ?? 0,
        });
      } catch {
        if (active) {
          setError("Unable to verify the admin session.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void verifyAdmin();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    setSigningOut(true);

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError("Unable to sign out. Please try again.");
      setSigningOut(false);
      return;
    }

    navigate("/admin", { replace: true });
  };

  const sections = [
    {
      title: "Activities",
      count: counts.activities,
      icon: Leaf,
      description: "Manage environmental initiatives",
    },
    {
      title: "Team Members",
      count: counts.team,
      icon: Users,
      description: "Manage the DSC team",
    },
    {
      title: "Events",
      count: counts.events,
      icon: CalendarDays,
      description: "Manage upcoming and past events",
    },
    {
      title: "Gallery",
      count: counts.gallery,
      icon: Image,
      description: "Manage photos and media",
    },
    {
      title: "Volunteers",
      count: counts.volunteers,
      icon: ClipboardList,
      description: "Review volunteer registrations",
    },
    {
      title: "Contact Messages",
      count: counts.messages,
      icon: MessageSquare,
      description: "Review contact submissions",
    },
  ];

  if (loading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
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
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Leaf className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                DSC Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Dharitree Samrakshana Chaitanyam
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={signingOut}
          >
            {signingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Sign Out
          </Button>
        </header>

        <Card>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Signed in as
              </p>
              <p className="font-medium">{adminEmail}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary">
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

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              Content Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Current records available in your DSC database
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Card key={section.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {section.title}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>

                  <CardContent>
                    <div className="text-3xl font-bold">
                      {section.count}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Management Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The dashboard overview is connected. Create, edit,
              publish, and delete controls will be added to each
              management module in the next stage.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminDashboard;
