import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />

              {/* Individual team member profile */}
              <Route path="/team/:id" element={<TeamProfile />} />

              <Route path="/focus-areas" element={<FocusAreas />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/contact" element={<Contact />} />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
