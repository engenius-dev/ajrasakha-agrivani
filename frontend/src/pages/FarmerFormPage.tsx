import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react"; 
import VoiceInput from "@/components/VoiceInput";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SchemesTicker from "@/components/SchemesTicker";
import { indianStates, districtsByState } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const categories = ["General", "SC", "ST", "OBC"];
type FormFields = "state" | "district" | "landSize" | "crop" | "category";

const FarmerFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const [form, setForm] = useState<Record<FormFields, string>>({
    state: user?.state || "",
    district: user?.district || "",
    landSize: user?.landSize || "",
    crop: "", 
    category: user?.category || "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        state: prev.state || user.state || "",
        district: prev.district || user.district || "",
        landSize: prev.landSize || user.landSize || "",
        category: prev.category || user.category || "",
      }));
    }
  }, [user]);

  const safeState = form.state as keyof typeof districtsByState;
  const districts = form.state && districtsByState[safeState] ? districtsByState[safeState] : ["Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/results", { state: form });
  };

  const update = (field: FormFields, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "state") updated.district = ""; 
      return updated;
    });
  };

  const handleVoiceResult = async (text: string) => {
    const lowerText = text.toLowerCase();
    
    let extractedState = "";
    let extractedCategory = "";
    let extractedLand = "";
    let extractedDistrict = "";
    let extractedCrop = ""; // <-- Added Crop Variable

    // 1. HEURISTIC PARSER
    indianStates.forEach((s) => {
      if (new RegExp(`\\b${s.toLowerCase()}\\b`, "i").test(lowerText)) extractedState = s;
    });
    
    categories.forEach((c) => {
      if (new RegExp(`\\b${c.toLowerCase()}\\b`, "i").test(lowerText)) extractedCategory = c;
    });
    
    const landMatch = lowerText.match(/(\d+(\.\d+)?)\s*(acre|acres|land|hec)/);
    if (landMatch) extractedLand = landMatch[1];

    const allDistricts = Object.values(districtsByState).flat();
    allDistricts.forEach((d) => {
      if (new RegExp(`\\b${d.toLowerCase()}\\b`, "i").test(lowerText)) extractedDistrict = d;
    });

    // THE FIX: Teach the heuristic some common crops!
    const commonCrops = ["Rice", "Wheat", "Sugarcane", "Cotton", "Maize", "Soybean", "Millet", "Jute", "Barley"];
    commonCrops.forEach((c) => {
      if (new RegExp(`\\b${c.toLowerCase()}\\b`, "i").test(lowerText)) extractedCrop = c;
    });

    const needsLLM = lowerText.includes("district") || lowerText.includes("grow") || lowerText.includes("crop") || lowerText.includes("plant");

    if (!needsLLM && extractedState && extractedLand && extractedCategory) {
      setForm(prev => ({
        ...prev,
        state: extractedState,
        district: extractedDistrict || (prev.state === extractedState ? prev.district : ""),
        category: extractedCategory,
        landSize: extractedLand,
        crop: extractedCrop || prev.crop // <-- Added Crop to the instant update!
      }));
      toast({ title: "Voice Parsed", description: "Details extracted instantly via keyword matching." });
      return;
    }

    // 2. THE CIRCUIT BREAKER (LLM FALLBACK)
    setIsProcessingVoice(true);
    toast({ title: "Analyzing Voice...", description: "Using AI to understand complex details." });

    try {
      const apiKey = (import.meta as unknown as { env: { VITE_GEMINI_API_KEY?: string } }).env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing API Key. Please check your .env file.");

      // FIX 1: Explicitly constrain the Category choices in the prompt
      const prompt = `Extract entities from this text: "${text}". If an entity is not mentioned, leave it as an empty string "". Return ONLY a JSON object with exact keys: "state", "district", "landSize", "crop", "category" (MUST be exactly one of: "General", "OBC", "SC", "ST").`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, responseMimeType: "application/json" } 
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`API Error: ${errData.error?.message || 'Failed to connect to Google'}`);
      }

      const data = await response.json();
      const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawResponse) {
        const llmData = JSON.parse(rawResponse);
        const getString = (val: unknown) => (val !== undefined && val !== null ? String(val).trim() : "");

        const parsedState = getString(llmData.state);
        const parsedDistrict = getString(llmData.district);
        const parsedCrop = getString(llmData.crop);
        const parsedLandSize = getString(llmData.landSize).replace(/[^0-9.]/g, "");

        // FIX 2: Normalize the category casing so React's <Select> component accepts it
        let parsedCategory = getString(llmData.category);
        if (/general/i.test(parsedCategory)) parsedCategory = "General";
        else if (/obc/i.test(parsedCategory)) parsedCategory = "OBC";
        else if (/sc/i.test(parsedCategory)) parsedCategory = "SC";
        else if (/st/i.test(parsedCategory)) parsedCategory = "ST";
        else parsedCategory = "";

        setForm(prev => {
          const newState = parsedState || prev.state;
          return {
            ...prev,
            state: newState,
            district: parsedDistrict || (newState !== prev.state ? "" : prev.district),
            landSize: parsedLandSize || prev.landSize,
            crop: parsedCrop || prev.crop,
            category: parsedCategory || prev.category,
          };
        });

        toast({ title: "AI Parsing Complete", description: "Form updated successfully." });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("LLM Fallback failed:", errorMessage);
      toast({ title: "Parsing Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const selectClass = "w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground text-base font-body outline-none focus:ring-2 focus:ring-ring appearance-none";
  const inputClass = selectClass;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SchemesTicker />
      <Navbar />

      <div className="container py-12 flex-1 max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Check Eligibility</h1>
          <p className="text-muted-foreground mb-8">Confirm your details and enter your current crop</p>

          <div className="flex justify-center mb-8 relative">
            <VoiceInput
              onResult={(text) => { void handleVoiceResult(text); }} 
              size="sm"
            />
            {isProcessingVoice && (
              <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
              <select value={form.state} onChange={(e) => update("state", e.target.value)} className={selectClass} required>
                <option value="">Select State</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">District</label>
              <select value={form.district} onChange={(e) => update("district", e.target.value)} className={selectClass} required disabled={!form.state}>
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Land Holding Size (acres)</label>
              <input type="number" step="0.1" min="0" value={form.landSize} onChange={(e) => update("landSize", e.target.value)} className={inputClass} placeholder="e.g. 2.5" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Crop Type</label>
              <input type="text" value={form.crop} onChange={(e) => update("crop", e.target.value)} className={inputClass} placeholder="e.g. Rice, Wheat" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Social Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className={selectClass} required>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessingVoice}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl hero-gradient text-primary-foreground font-display font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow mt-4 disabled:opacity-70"
            >
              {isProcessingVoice ? "Processing Voice..." : "Check My Eligibility"}
              {!isProcessingVoice && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerFormPage;