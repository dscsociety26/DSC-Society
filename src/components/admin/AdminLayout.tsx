import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  CalendarDays,
  Users,
  Images,
  ClipboardList,
  Mail,
  Menu,
  X,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import dscLogo from "@/assets/dsc-logo.png";
import { supabase } from "@/lib/supabase";

const navigation = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Activities", path: "/admin/activities", icon: Leaf },
  { label: "Events", path: "/admin/events", icon: CalendarDays },
  { label: "Team Members", path: "/admin/team", icon: Users },
  { label: "Gallery", path: "/admin/gallery", icon: Images },
  { label: "Volunteers", path: "/admin/volunteers", icon: ClipboardList },
  { label: "Messages", path: "/admin/contacts", icon: Mail },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setSigningOut(true);
    setError("");

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        setError("Unable to sign out. Please try again.");
        setSigningOut(false);
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("Unable to sign out. Please try again.");
      setSigningOut(false);
    }
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <img
          src={dscLogo}
          alt="DSC Society Logo"
          className="h-12 w-12 rounded-xl border border-slate-100 object-contain"
        />
        <div className="min-w-0">
          <p className="font-bold tracking-tight text-slate-900">
            DSC Society
          </p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Admin Panel
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 pb-2 pt-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-2">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Administrator
            </p>
            <p className="text-xs text-slate-500">Secure workspace</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-3 text-xs text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <LogOut className="h-[18px] w-[18px]" />
          )}
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        {sidebar}
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <img src={dscLogo} alt="" className="h-9 w-9 object-contain" />
        <span className="font-semibold text-slate-900">DSC Admin</span>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/40"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
}
