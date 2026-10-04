import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/dsc-logo.png";

const Footer = () => {
  return (
    <footer className="gradient-dark text-primary-foreground">
      <div className="container-narrow section-padding">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="DSC Society Logo"
                className="h-12 w-12 rounded-full opacity-90"
              />
              <span className="font-heading font-bold text-lg">
                DSC Society
              </span>
            </div>

            <p className="text-sm opacity-80 leading-relaxed">
              Dharitree Samrakshana Chaitanyam Society empowers communities
              to fight plastic pollution and create lasting environmental change.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">
              Quick Links
            </h4>

            <div className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Focus Areas", path: "/focus-areas" },
                { label: "Gallery", path: "/gallery" },
                { label: "Join Us", path: "/join-us" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">
              Contact Us
            </h4>

            <div className="flex flex-col gap-3">

              <div className="flex items-start gap-2 text-sm opacity-80">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>
                  28-7-154, Guntur, Andhra Pradesh 522002
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm opacity-80">
                <Phone size={16} className="shrink-0" />
                <span>+91 9703342045</span>
              </div>

              <div className="flex items-center gap-2 text-sm opacity-80">
                <Mail size={16} className="shrink-0" />
                <span>dscsociety.org@gmail.com</span>
              </div>

            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">
              Follow Us
            </h4>

            <div className="flex gap-3">

              <a
                href="https://www.instagram.com/d_s_c_society/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow DSC Society on Instagram"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                aria-label="DSC Society YouTube"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Youtube size={18} />
              </a>

            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/20 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Dharitree Samrakshana Chaitanyam Society.
          All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
