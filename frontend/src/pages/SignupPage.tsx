import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, ShieldCheck, Loader2, MapPin, User } from "lucide-react"; // REMOVED unused 'Sprout' icon
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { indianStates } from "@/data/mockData";

/**
 * SignupPage Component
 * Handles the registration of new farmers. Collects basic details (Name, Phone, State)
 * to initialize a profile before they enter the main application.
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates the form and submits the new user data.
   */
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic frontend validation
    if (formData.phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // TODO (Phase 2): Replace this setTimeout with an actual API call.
    // Example: await axios.post('/api/auth/register', formData);
    // Upon success, you will receive a token/user object from your Express server.
    setTimeout(() => {
      // Currently using the mock 'login' function from AuthContext
      login(formData.phone, { name: formData.name, state: formData.state });
      navigate("/");
      toast({
        title: "Registration Successful",
        description: `Welcome to AgriVani, ${formData.name}!`,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Column: Branding (Consistent with Login) */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary-dark" />
        
        <div className="relative z-10 max-w-lg text-white text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="inline-flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 overflow-hidden">
                <img src="/logo.png" alt="AgriVani Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-3xl font-display font-bold tracking-tight">AgriVani</span>
            </Link>
            
            <h1 className="text-5xl font-display font-bold leading-tight mb-8">
              Every Village, <span className="text-accent underline decoration-accent/30 underline-offset-8">Every Farmer</span>, Connected.
            </h1>
            
            <div className="space-y-8">
              {[
                { icon: ShieldCheck, title: "Official Schemes", desc: "Access 500+ Central and State government schemes directly." },
                { icon: MapPin, title: "Localization", desc: "Get benefits and news specific to your state and district." },
                { icon: UserPlus, title: "Easy Registration", desc: "Just use your phone number to get started in seconds." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="flex-[0.8] flex items-center justify-center p-6 sm:p-12 bg-background relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-display font-bold text-foreground">New Farmer Registration</h2>
            <p className="text-muted-foreground mt-2 text-lg">Create your profile to unlock all benefits</p>
          </div>

          <form onSubmit={handleSignup} className="bg-card glass-card p-10 rounded-3xl border border-border/50 shadow-2xl relative space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Enter your name"
                    className="pl-11 h-14 rounded-xl border-border bg-background focus:ring-primary focus:border-primary transition-all text-base"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border pr-3">
                    <span className="text-sm font-bold text-muted-foreground group-focus-within:text-primary transition-colors">+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="98765 43210"
                    className="pl-20 h-14 rounded-xl border-border bg-background focus:ring-primary focus:border-primary transition-all text-base"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">State</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                  <Select onValueChange={(val) => setFormData({ ...formData, state: val })} required>
                    <SelectTrigger className="pl-11 h-14 rounded-xl border-border bg-background focus:ring-primary transition-all text-base">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state} className="text-sm focus:bg-primary/10">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              disabled={isSubmitting || !formData.name || formData.phone.length < 10 || !formData.state}
              className="w-full h-15 rounded-xl text-lg font-bold bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all group/btn mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Register & Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              By registering, you agree to receive government scheme updates via SMS.
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login instead</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;