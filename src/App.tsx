
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Index from "./pages/Index";
import About from "./pages/About";
import TeamProfile from "./pages/TeamProfile";
import FocusAreas from "./pages/FocusAreas";
import Gallery from "./pages/Gallery";
import JoinUs from "./pages/JoinUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminActivities from "./pages/admin/AdminActivities";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Navbar />

          <main>
            <Routes>
              {/* Public Website */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/team/:id" element={<TeamProfile />} />
              <Route path="/focus-areas" element={<FocusAreas />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Panel */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />
              <Route
                path="/admin/activities"
                element={<AdminActivities />}
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </BrowserRouter>

        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
