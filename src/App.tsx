import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import SEO from "./components/SEO";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Activities = lazy(() => import("./pages/Activities"));
const Events = lazy(() => import("./pages/Events"));
const TeamProfile = lazy(() => import("./pages/TeamProfile"));
const FocusAreas = lazy(() => import("./pages/FocusAreas"));
const Gallery = lazy(() => import("./pages/Gallery"));
const JoinUs = lazy(() => import("./pages/JoinUs"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminHomepage = lazy(() => import("./pages/admin/AdminHomepage"));
const AdminActivities = lazy(() => import("./pages/admin/AdminActivities"));
const AdminTeam = lazy(() => import("./pages/admin/AdminTeam"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminVolunteers = lazy(() => import("./pages/admin/AdminVolunteers"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div
      className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-600"
      aria-label="Loading"
    />
  </div>
);

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <SEO />
      {!isAdminRoute && <Navbar />}

      <main className={isAdminRoute ? "min-h-screen" : ""}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Website */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/events" element={<Events />} />
            <Route path="/team/:id" element={<TeamProfile />} />
            <Route path="/focus-areas" element={<FocusAreas />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Login */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected Admin Panel */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path="/admin/homepage"
                  element={<AdminHomepage />}
                />
                <Route
                  path="/admin/activities"
                  element={<AdminActivities />}
                />
                <Route path="/admin/team" element={<AdminTeam />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route
                  path="/admin/volunteers"
                  element={<AdminVolunteers />}
                />
                <Route
                  path="/admin/contacts"
                  element={<AdminContacts />}
                />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>

        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
