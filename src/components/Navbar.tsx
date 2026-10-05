import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/dsc-logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Activities", path: "/activities" },
  { label: "Events", path: "/events" },
  { label: "Focus Areas", path: "/focus-areas" },
  { label: "Gallery", path: "/gallery" },
  { label: "Join Us", path: "/join-us" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="DSC Society" className="h-12 w-12 rounded-full" />
          <div className="hidden sm:block">
            <span className="font-heading text-sm font-bold text-primary leading-tight block">
              DSC Society
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              Dharitree Samrakshana Chaitanyam
            </span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button className="ml-4 gradient-green border-0 text-primary-foreground font-heading font-semibold">
            Donate
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-md border-t border-border">
          <div className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button className="mt-2 gradient-green border-0 text-primary-foreground font-heading font-semibold">
              Donate
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
