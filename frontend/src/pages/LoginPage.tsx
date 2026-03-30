import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, ShieldCheck, Sprout, Loader2, 
  User, Calendar, Mic, MicOff, Sparkles, Volume2 
} from "lucide-react"; // Merged and cleaned unused icons
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { indianStates } from "@/data/mockData";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
// REMOVED unused VoiceInput import
// REMOVED unused useEffect and useRef imports

/**
 * LoginPage Component
 * Handles the 3-step onboarding process: Phone Entry -> OTP Verification -> Profile Creation.
 * Includes an integrated Voice Assistant to guide farmers through the form.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Step Management
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    state: "",
    category: "",
    landSize: ""
  });

  // Voice Assistant State
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [assistantStep, setAssistantStep] = useState(0);
  
  const assistantSteps = [
    { field: "name", question: "What is your full name?", prompt: "Please say your name clearly." },
    { field: "age", question: "How old are you?", prompt: "Say your age in years." },
    { field: "gender", question: "Are you Male or Female?", prompt: "Say Male or Female." },
    { field: "state", question: "Which state are you from?", prompt: "Say your state name." },
    { field: "landSize", question: "How many acres of land do you have?", prompt: "Specify land in acres." },
    { field: "category", question: "What is your social category?", prompt: "Say General, OBC, SC or ST." }
  ];

  /**
   * Browser-native Text-to-Speech implementation.
   */
  const speak = (text: string, callback?: () => void) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.onend = () => callback?.();
    synth.speak(utterance);
  };

  const { isListening, transcript, stopListening, startListening } = useSpeechRecognition({
    onResult: (text) => {
      if (!isAssistantActive) return;
      handleAssistantResult(text);
    }
  });

  /**
   * Evaluates the spoken text and maps it to the current form field.
   */
  const handleAssistantResult = (text: string) => {
    const step = assistantSteps[assistantStep - 1];
    if (!step) return;

    const lowerText = text.toLowerCase();
    const newProfile = { ...profile };

    // TODO (Phase 2): This entire if/else block is highly brittle. 
    // We will send 'text' to Gemini via our Express backend to extract 
    // the JSON entities accurately, regardless of the farmer's phrasing.
    if (step.field === "name") {
      const cleaned = text.replace(/^(my name is|i am|name is|this is|call me|myself|i'm)\s+/i, "").trim();
      if (cleaned) newProfile.name = cleaned;
    } else if (step.field === "age") {
      const num = text.match(/\d+/);
      if (num) newProfile.age = num[0];
    } else if (step.field === "landSize") {
      const num = text.match(/\d+(?:\.\d+)?/);
      if (num) newProfile.landSize = num[0];
    } else if (step.field === "gender") {
      if (lowerText.includes("male") || lowerText.includes("man")) newProfile.gender = "Male";
      else if (lowerText.includes("female") || lowerText.includes("woman")) newProfile.gender = "Female";
    } else if (step.field === "state") {
      const found = indianStates.find(s => lowerText.includes(s.toLowerCase()));
      if (found) newProfile.state = found;
    } else if (step.field === "category") {
      if (lowerText.includes("general")) newProfile.category = "General";
      else if (lowerText.includes("obc")) newProfile.category = "OBC";
      else if (lowerText.includes("sc") || lowerText.includes("s.c")) newProfile.category = "SC";
      else if (lowerText.includes("st") || lowerText.includes("s.t")) newProfile.category = "ST";
    }

    setProfile(newProfile);
    stopListening();
    
    // Auto-advance to the next question
    if (assistantStep < assistantSteps.length) {
      setTimeout(() => proceedToNextStep(assistantStep + 1), 500);
    } else {
      speak("Thank you! Your profile is ready. Please check if everything is correct and click complete my profile.");
      setIsAssistantActive(false);
      setAssistantStep(0);
    }
  };

  const proceedToNextStep = (stepIdx: number) => {
    setAssistantStep(stepIdx);
    const step = assistantSteps[stepIdx - 1];
    if (step) {
      speak(step.question, () => {
        setTimeout(() => startListening(), 800);
      });
    }
  };

  const startAssistant = () => {
    setIsAssistantActive(true);
    speak("Namaste! I am your AgriVani Assistant. I will help you fill your form. Let's start. What is your full name?", () => {
      setAssistantStep(1);
      setTimeout(() => startListening(), 800);
    });
  };

  /**
   * Step 1: Request OTP
   */
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    setIsSubmitting(true);
    // TODO (Phase 2): Replace with axios.post('/api/auth/send-otp', { phone })
    setTimeout(() => {
      setStep(2);
      setIsSubmitting(false);
      toast({ title: "OTP Sent", description: "A 4-digit code has been sent to your phone." });
    }, 1000);
  };

  /**
   * Step 2: Verify OTP
   */
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO (Phase 2): Replace hardcoded "1234" with axios.post('/api/auth/verify-otp', { phone, otp })
    if (otp !== "1234") { 
      toast({ title: "Invalid OTP", description: "Use 1234 for testing.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setStep(3);
      setIsSubmitting(false);
      toast({ title: "Verified!", description: "Please complete your farm profile." });
    }, 800);
  };

  /**
   * Step 3: Finalize Profile
   */
  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO (Phase 2): Replace with axios.post('/api/users/profile', profile)
    setTimeout(() => {
      login(phone, profile);
      navigate("/");
      toast({ title: "Registration Complete", description: `Welcome to AgriVani, ${profile.name}!` });
      setIsSubmitting(false);
    }, 1000);
  };

  // ... (UI Render code remains exactly the same)
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Column: Branding */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary-dark" />
        
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 overflow-hidden">
                <img src="/logo.png" alt="AgriVani Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-4xl font-display font-bold tracking-tight">AgriVani</span>
            </div>
            
            <h1 className="text-5xl font-display font-bold leading-tight mb-6">
              Empowering Every <span className="text-accent underline decoration-accent/30 underline-offset-8">Farmer</span> with Direct Knowledge.
            </h1>
            
            <p className="text-xl text-white/80 font-medium leading-relaxed mb-12">
              Join thousands of farmers across India in discovering government schemes, market insights, and agricultural support tailored for you.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <ShieldCheck className="w-6 h-6 text-accent mb-2" />
                <span className="text-sm font-bold block">Secure Access</span>
                <span className="text-[11px] text-white/50">Your data is safe with us.</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <Sprout className="w-6 h-6 text-accent mb-2" />
                <span className="text-sm font-bold block">Real-time Updates</span>
                <span className="text-[11px] text-white/50">Get instant scheme alerts.</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-dark/50 rounded-full blur-[120px]" />
      </div>

      {/* Right Column: Entrance / Login Flow */}
      <div className="flex-[0.8] flex items-center justify-center p-6 sm:p-12 bg-background relative overflow-hidden">
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 flex items-center gap-2 md:hidden">
          <img src="/logo.png" alt="AgriVani Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-display font-bold text-gradient">AgriVani</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-display font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">
              {step === 3 
                ? (isAssistantActive ? `Assistant: ${assistantSteps[assistantStep-1]?.question || "Processing..."}` : "Complete your profile. Use the voice assistant for help!") 
                : "Enter your phone number to access your dashboard"}
            </p>
          </div>

          <div className="bg-card glass-card p-8 rounded-3xl border border-border/50 shadow-xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border pr-3">
                      <span className="text-sm font-bold text-foreground">+91</span>
                    </div>
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      className="pl-20 h-14 rounded-xl border-border bg-background focus-visible:ring-primary transition-all text-lg font-medium"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                    />
                  </div>
                </div>

                <Button 
                  disabled={isSubmitting || phone.length < 10}
                  className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all group/btn"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                    <>
                      Get Security Code
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            ) : step === 2 ? (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter the 4-digit code sent to <span className="font-bold text-foreground">+91 {phone}</span>
                    </p>
                    <div className="flex justify-center gap-3">
                      <Input
                        type="text"
                        maxLength={4}
                        placeholder="····"
                        className="w-48 h-16 text-center text-3xl font-bold tracking-[1em] rounded-2xl border-border focus-visible:ring-primary"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-primary hover:underline block mx-auto py-2">
                    Change Number
                  </button>
                </div>

                <Button 
                  disabled={isSubmitting || otp.length < 4}
                  className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all group/btn"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCompleteProfile} className="space-y-5">
                <div className="space-y-4">
                  {/* Voice Assistant Section */}
                  <div className={`rounded-2xl p-6 border transition-all duration-500 mb-6 ${isAssistantActive ? "bg-primary text-white border-primary shadow-2xl scale-[1.02]" : "bg-primary/5 border-primary/10 text-foreground"}`}>
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? "bg-white text-primary animate-pulse ring-8 ring-white/20" : isAssistantActive ? "bg-white/90 text-primary" : "bg-primary/20 text-primary"}`}>
                        {isListening ? <Mic className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {isListening ? "Listening to you..." : isAssistantActive ? "Assistant is Speaking..." : "AgriVani Voice Assistant"}
                        </h3>
                        <p className={`text-sm ${isAssistantActive ? "text-white/80" : "text-muted-foreground"}`}>
                          {isAssistantActive 
                            ? (isListening ? (transcript ? `You said: "${transcript}"` : assistantSteps[assistantStep-1]?.prompt) : `Question: ${assistantSteps[assistantStep-1]?.question || "Welcome"}`)
                            : "Click to fill the entire form by speaking with our assistant"}
                        </p>
                        {isListening && transcript && (
                          <div className="mt-2 text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full animate-in fade-in slide-in-from-bottom-1 inline-block">
                            Parsing: {assistantSteps[assistantStep-1]?.field}
                          </div>
                        )}
                      </div>
                      <Button 
                        type="button"
                        onClick={isAssistantActive ? () => setIsAssistantActive(false) : startAssistant}
                        size="lg"
                        className={`h-14 rounded-full px-8 text-lg font-bold shadow-xl transition-all ${isAssistantActive ? "bg-white text-destructive hover:bg-white/90" : "bg-primary text-white"}`}
                      >
                        {isAssistantActive ? (
                          <>
                            <MicOff className="w-6 h-6 mr-2" />
                            Stop Assistant
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6 mr-2" />
                            Start Voice Assistant
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Form Fields Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`space-y-1.5 p-3 rounded-xl transition-all ${assistantStep === 1 ? "bg-primary/10 ring-2 ring-primary" : ""}`}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${assistantStep === 1 ? "text-primary" : "text-muted-foreground"}`} />
                        <Input 
                          placeholder="Your Name" 
                          className={`pl-9 h-11 rounded-lg border-border transition-all ${assistantStep === 1 ? "ring-2 ring-primary/20 bg-primary/5 border-primary/50" : ""}`}
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className={`space-y-1.5 p-3 rounded-xl transition-all ${assistantStep === 2 ? "bg-primary/10 ring-2 ring-primary" : ""}`}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Age</label>
                      <div className="relative">
                        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${assistantStep === 2 ? "text-primary" : "text-muted-foreground"}`} />
                        <Input 
                          type="number" 
                          placeholder="Years" 
                          className={`pl-9 h-11 rounded-lg border-border transition-all ${assistantStep === 2 ? "ring-2 ring-primary/20 bg-primary/5 border-primary/50" : ""}`}
                          value={profile.age}
                          onChange={(e) => setProfile({...profile, age: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`space-y-1.5 p-3 rounded-xl transition-all ${assistantStep === 3 ? "bg-primary/10 ring-2 ring-primary" : ""}`}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Gender</label>
                      <Select value={profile.gender} onValueChange={(v) => setProfile({...profile, gender: v})} required>
                        <SelectTrigger className={`h-11 rounded-lg border-border transition-all ${assistantStep === 3 ? "ring-2 ring-primary/20 bg-primary/5 border-primary/50" : ""}`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={`space-y-1.5 p-3 rounded-xl transition-all ${assistantStep === 5 ? "bg-primary/10 ring-2 ring-primary" : ""}`}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Land Size (Acres)</label>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 2.5" 
                        className={`h-11 rounded-lg border-border transition-all ${assistantStep === 5 ? "ring-2 ring-primary/20 bg-primary/5 border-primary/50" : ""}`}
                        value={profile.landSize}
                        onChange={(e) => setProfile({...profile, landSize: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className={`space-y-1.5 p-3 rounded-xl transition-all ${assistantStep === 4 ? "bg-primary/10 ring-2 ring-primary" : ""}`}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">State</label>
                    <Select value={profile.state} onValueChange={(v) => setProfile({...profile, state: v})} required>
                      <SelectTrigger className={`h-11 rounded-lg border-border transition-all ${assistantStep === 4 ? "ring-2 ring-primary/20 bg-primary/5 border-primary/50" : ""}`}>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-48">
                        {indianStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className={`space-y-1.5 p-3 rounded-xl transition-all ${assistantStep === 6 ? "bg-primary/10 ring-2 ring-primary" : ""}`}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                    <Select value={profile.category} onValueChange={(v) => setProfile({...profile, category: v})} required>
                      <SelectTrigger className={`h-11 rounded-lg border-border transition-all ${assistantStep === 6 ? "ring-2 ring-primary/20 bg-primary/5 border-primary/50" : ""}`}>
                        <SelectValue placeholder="Social Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all mt-4"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Complete My Profile"}
                </Button>
              </form>
            )}
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Register as a New Farmer</Link>
            </p>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified by Ministry of Agriculture
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
