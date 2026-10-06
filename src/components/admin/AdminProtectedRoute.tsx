import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

const AdminProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAdminAccess = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (active) {
            setAuthorized(false);
            setChecking(false);
          }
          return;
        }

        const { data: profile, error } = await supabase
          .from("admin_profiles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!active) return;

        if (error || profile?.role !== "admin") {
          await supabase.auth.signOut();
          setAuthorized(false);
          setChecking(false);
          return;
        }

        setAuthorized(true);
        setChecking(false);
      } catch (error) {
        console.error("Admin authorization check failed:", error);

        if (active) {
          setAuthorized(false);
          setChecking(false);
        }
      }
    };

    void checkAdminAccess();

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          Verifying administrator access...
        </div>
      </main>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
