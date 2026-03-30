import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { SiX } from "react-icons/si";

/**
 * Footer Component:
 * A responsive, globally accessible footer containing brand information, 
 * internal navigation, and static external links.
 */
const Footer = () => {
  // useNavigate is used for internal app navigation. 
  // It prevents the browser from doing a full page refresh, preserving our global React state.
  const navigate = useNavigate();

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
      <div className="container overflow-hidden">
        {/* Responsive Grid Architecture:
          - grid-cols-1: On mobile phones, all 4 sections stack vertically.
          - md:grid-cols-4: On tablets and desktops, it splits into 4 equal columns.
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* --- Column 1: Brand Section --- */}
          <div className="space-y-6 col-span-1 md:col-span-1">
            <div 
              className="flex items-center gap-1 cursor-pointer w-fit" 
              onClick={() => navigate("/")}
            >
              <span className="font-display font-bold text-2xl text-gradient">AgriVani</span>
              <img src="/logo.png" alt="AgriVani Logo" className="w-10 h-10 object-contain" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Bridging the gap between farmers and government opportunities through AI-powered 
              eligibility assessment and localized guidance.
            </p>
            <div className="flex gap-4">
              {/* External social links safely use standard <a> tags since they leave the app */}
              <a href="#" className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all">
                <SiX className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all">
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* --- Column 2: Quick Links (Internal Navigation) --- */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                {/* Using navigate() instead of href="/" to maintain Single Page Application (SPA) speed */}
                <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/check")} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Check Eligibility
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Available Schemes
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Knowledge Hub
                </a>
              </li>
            </ul>
          </div>

          {/* --- Column 3: Support & Legal --- */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-foreground">Legal & Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Farmer Bill of Rights
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* --- Column 4: Contact Info --- */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span>support@agrivani.gov.in</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span>1800-AGRI-2026</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 AgriVani. Powering the Digital India Mission.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Government Portals <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Feedback <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;