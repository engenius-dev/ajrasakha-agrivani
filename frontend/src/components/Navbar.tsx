import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// REMOVED unused 'Type' and 'ClipboardList'
import { 
  Search, Languages, ChevronDown, Menu, Bell, User,
  ArrowRight, Sprout, X, LogOut
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO (Phase 2): This static mock data will be replaced by an API call
import { mockSchemes } from "@/data/mockData";

import SchemeModal from "@/components/SchemeModal";
import ProfileModal from "@/components/ProfileModal";
import AppliedSchemesModal from "@/components/AppliedSchemesModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SchemeData } from "@/components/SchemeCard";
import { useAuth } from "@/context/AuthContext";

/**
 * Navbar Component
 * The persistent top navigation bar. Handles global search, accessibility settings, 
 * user profile dropdowns, and triggers for global modals.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // UI States
  const [fontSize, setFontSize] = useState("normal");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAppliedOpen, setIsAppliedOpen] = useState(false);
  const [selectedModalScheme, setSelectedModalScheme] = useState<SchemeData | null>(null);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchemes, setFilteredSchemes] = useState<SchemeData[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Ref used to detect clicks outside the search bar component
  const searchRef = useRef<HTMLDivElement>(null);

  /**
   * COMPLEX LOGIC 1: The Search Filter Effect
   * Whenever 'searchQuery' changes, this runs. If the user types more than 1 letter,
   * it filters the scheme database.
   * * TODO (Phase 2): In a real app with thousands of schemes, you don't download them all
   * to the frontend. You would replace this with a "Debounced API Call" 
   * (e.g., axios.get(`/api/schemes/search?q=${searchQuery}`))
   */
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = mockSchemes.filter(scheme => 
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSchemes(results);
    } else {
      setFilteredSchemes([]);
    }
  }, [searchQuery]);

  /**
   * COMPLEX LOGIC 2: The "Click Outside" Listener
   * This is a classic React pattern to close custom dropdowns. It attaches an event 
   * listener to the entire document. If a click happens, it checks if the click 
   * occurred *inside* the 'searchRef' div. If it was outside, it hides the search results.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    
    // Attach listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup listener when component unmounts to prevent memory leaks
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full flex flex-col">
        {/* --- Utility/Accessibility Bar (Top Thin Bar) --- */}
        <div className="bg-card/50 backdrop-blur-md border-b border-border/50 py-1 hidden sm:block">
          <div className="container flex justify-end items-center gap-6">
            
            {/* Font Size Toggles (Currently visual UI only - needs CSS var wiring for Phase 2) */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Accessibility:</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setFontSize("small")}
                  className={`w-6 h-6 rounded flex items-center justify-center text-[10px] border ${fontSize === 'small' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary'}`}
                >A-</button>
                <button 
                  onClick={() => setFontSize("normal")}
                  className={`w-6 h-6 rounded flex items-center justify-center text-[11px] border ${fontSize === 'normal' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary'}`}
                >A</button>
                <button 
                  onClick={() => setFontSize("large")}
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs border ${fontSize === 'large' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary'}`}
                >A+</button>
              </div>
            </div>
            
            <div className="h-3 w-[1px] bg-border" />

            {/* Theme Toggle Component */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Theme:</span>
              <ThemeToggle />
            </div>
            
            <div className="h-3 w-[1px] bg-border" />

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors outline-none">
                <Languages className="w-3.5 h-3.5" />
                English
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-xs font-medium focus:bg-primary focus:text-primary-foreground">English</DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-medium focus:bg-primary focus:text-primary-foreground">हिन्दी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-medium focus:bg-primary focus:text-primary-foreground">मराठी (Marathi)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-medium focus:bg-primary focus:text-primary-foreground">বাংলা (Bengali)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* --- Main Nav Bar --- */}
        <nav className="bg-card/90 backdrop-blur-xl border-b border-border/50 shadow-sm transition-all duration-300">
          <div className="container flex items-center justify-between h-20 sm:h-24">
            
            {/* Logo */}
            <div className="flex items-center gap-1 cursor-pointer shrink-0" onClick={() => navigate("/")}>
              <span className="font-display font-bold text-2xl sm:text-3xl text-gradient">AgriVani</span>
              <img src="/logo.png" alt="AgriVani Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
            </div>

            {/* Search Bar Container */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center max-w-2xl px-8">
              <div className="relative group w-full" ref={searchRef}>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for schemes (e.g. Kisan, Solar)..." 
                  className="w-full h-11 bg-muted/50 border border-transparent rounded-2xl pl-10 pr-10 text-sm focus:outline-none focus:border-primary/30 focus:bg-card transition-all placeholder:text-muted-foreground/60"
                />
                
                {/* Clear Search Button (X) */}
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* The Floating Search Results Dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[320px]">
                    {searchQuery.trim().length > 1 ? (
                      <div className="p-2">
                        {filteredSchemes.length > 0 ? (
                          <>
                            <div className="px-3 py-2 border-b border-border/50 mb-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Search Results</span>
                            </div>
                            {/* Maps over the filtered mockSchemes array */}
                            {filteredSchemes.map((scheme) => (
                              <button
                                key={scheme.id}
                                onClick={() => {
                                  setSelectedModalScheme(scheme);
                                  setIsSearchFocused(false);
                                  setSearchQuery("");
                                }}
                                className="w-full text-left p-3 rounded-xl hover:bg-primary/5 transition-all group"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-bold text-foreground group-hover:text-primary">{scheme.name}</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-[11px] text-muted-foreground line-clamp-1">{scheme.description}</p>
                              </button>
                            ))}
                          </>
                        ) : (
                          // Zero Results State
                          <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                              <Search className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-foreground">No matches found</p>
                            <p className="text-xs text-muted-foreground mt-1">Try different keywords like "Land" or "Soil"</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Discovery Mode (What shows up before you start typing)
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-border/50 mb-3">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recommended for You</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1 mb-4">
                          {mockSchemes.slice(0, 4).map((scheme) => (
                            <button
                              key={scheme.id}
                              onClick={() => {
                                setSelectedModalScheme(scheme);
                                setIsSearchFocused(false);
                              }}
                              className="w-full text-left p-3 rounded-xl hover:bg-primary/5 transition-all group flex items-start gap-3 border border-transparent hover:border-primary/10"
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                                <Sprout className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-sm font-bold text-foreground group-hover:text-primary">{scheme.name}</span>
                                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <p className="text-[10px] text-muted-foreground line-clamp-1 font-medium">{scheme.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* --- Right Section (User Actions) --- */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Notifications */}
              <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/20">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card" />
              </button>
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pr-1 sm:pr-4 pl-1 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary transition-all group overflow-hidden outline-none">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-95 transition-transform">
                      <User className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter leading-none mb-0.5 group-hover:text-primary-foreground/60">Verified Farmer</p>
                      {/* Pulls real name from AuthContext */}
                      <p className="text-sm font-bold text-primary group-hover:text-primary-foreground leading-none">{user?.name || "Farmer"}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 bg-card border-border shadow-2xl rounded-2xl">
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-sm font-bold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.phone}</p>
                  </div>
                  {/* These triggers open the hidden modals below */}
                  <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="p-2 rounded-xl focus:bg-primary/5 cursor-pointer flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsAppliedOpen(true)} className="p-2 rounded-xl focus:bg-primary/5 cursor-pointer flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">My Applied Schemes</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem onClick={logout} className="p-2 rounded-xl focus:bg-destructive/10 text-destructive cursor-pointer flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-bold">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <button className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground transition-all">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Global Modals (Hidden by default, triggered by Navbar state) */}
      <SchemeModal scheme={selectedModalScheme} onClose={() => setSelectedModalScheme(null)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <AppliedSchemesModal isOpen={isAppliedOpen} onClose={() => setIsAppliedOpen(false)} />
    </>
  );
};

export default Navbar;