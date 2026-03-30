import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; // REMOVED ArrowLeft
import VoiceInput from "@/components/VoiceInput";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SchemesTicker from "@/components/SchemesTicker";
import { indianStates, districtsByState } from "@/data/mockData";

const categories = ["General", "SC", "ST", "OBC"];

/**
 * FarmerFormPage Component
 * Handles the collection of farmer data either via manual form entry 
 * or basic voice-to-text heuristics.
 */
const FarmerFormPage = () => {
  const navigate = useNavigate();
  // REMOVED isListening state as it was unused
  const [form, setForm] = useState({
    state: "",
    district: "",
    landSize: "",
    crop: "",
    category: "",
  });

  // Dynamically load districts based on the currently selected state
  const districts = form.state ? districtsByState[form.state] || ["Other"] : [];

  /**
   * Submits the form and routes the user to the Results page.
   * Passes the collected form data through React Router's state object.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/results", { state: form });
  };

  /**
   * Generic updater function for form fields.
   * Automatically clears the district if the state is changed.
   */
  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "state") setForm((prev) => ({ ...prev, state: value, district: "" }));
  };

  const selectClass =
    "w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground text-base font-body outline-none focus:ring-2 focus:ring-ring appearance-none";
  const inputClass = selectClass;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SchemesTicker />
      <Navbar />

      <div className="container py-12 flex-1 max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Farmer Profile</h1>
          <p className="text-muted-foreground mb-8">Enter your details or use voice input</p>

          <div className="flex justify-center mb-8">
            <VoiceInput
              onResult={(text) => {
                const lowerText = text.toLowerCase();
                
                // --- HEURISTIC AUTO-FILL LOGIC ---
                // TODO (Phase 2): Replace this fragile matching with an LLM prompt
                // that extracts entities intelligently.

                // 1. Check if the spoken text contains any known state names
                indianStates.forEach((s) => {
                  if (lowerText.includes(s.toLowerCase())) update("state", s);
                });

                // 2. Check if the spoken text contains any social category
                categories.forEach((c) => {
                  if (lowerText.includes(c.toLowerCase())) update("category", c);
                });

                // 3. Regex Match for Land Size
                // Looks for digits (\d+), optional decimals (\.\d+), 
                // followed by spacing and words like acre/land/hec
                const landMatch = lowerText.match(/(\d+(\.\d+)?)\s*(acre|acres|land|hec)/);
                if (landMatch) update("landSize", landMatch[1]);
              }}
              size="sm"
            />
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

            {/* District dropdown is disabled until a State is selected */}
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
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl hero-gradient text-primary-foreground font-display font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow mt-4"
            >
              Check My Eligibility
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerFormPage;