import { X, FileText, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { SchemeData } from "./SchemeCard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

interface SchemeModalProps {
  scheme: SchemeData | null;
  onClose: () => void;
}

/**
 * SchemeModal Component
 * A detailed overlay displaying comprehensive information about a specific government scheme.
 * It adapts its UI based on the current route and user eligibility.
 */
const SchemeModal = ({ scheme, onClose }: SchemeModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, applyToScheme } = useAuth();
  const { toast } = useToast();
  
  if (!scheme) return null;

  // Checks if the user has already applied to this specific scheme
  const isApplied = user?.appliedSchemes?.some(s => s.id === scheme.id);
  
  // Determines if the user is in "Discovery Mode" (Homepage) or "Evaluation Mode" (Results)
  const isResultsPage = location.pathname === "/results" || location.pathname === "/dashboard";
  
  // TODO (Phase 2): This is currently hardcoded. The `SchemeData` interface should be updated 
  // to include a `requiredDocuments: string[]` field, which the backend RAG pipeline will provide dynamically.
  const requiredDocs = ["Aadhaar Card", "Land Record", "Bank Passbook"];

  return (
    <AnimatePresence>
      {scheme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl"
          >
            {/* Header section with dynamic eligibility badging */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">{scheme.name}</h2>
                {isResultsPage ? (
                  scheme.eligible ? (
                    <span className="inline-flex items-center gap-1 text-sm text-success font-medium mt-1">
                      <CheckCircle2 className="w-4 h-4" /> Eligible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-destructive font-medium mt-1">
                      <XCircle className="w-4 h-4" /> Not Eligible
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-1">
                    Information Mode
                  </span>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scheme Details Body */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</h3>
                <p className="text-foreground text-sm leading-relaxed">{scheme.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Eligibility Rule</h3>
                <p className="text-foreground text-sm leading-relaxed">{scheme.eligibilityRule}</p>
              </div>

              {/* RAG "Show Your Work" Section */}
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-info" />
                  <h3 className="text-sm font-semibold text-foreground">Extracted Proof</h3>
                </div>
                <p className="text-sm text-muted-foreground italic">"{scheme.proofText}"</p>
              </div>

              {/* Required Documents Section */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Required Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {requiredDocs.map((doc) => (
                    <div key={doc} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground text-xs font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                {isApplied ? (
                  <div className="w-full py-4 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" /> Application Submitted
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      // TODO (Phase 2): Replace with axios.post('/api/applications/apply', { schemeId: scheme.id })
                      applyToScheme({ id: scheme.id, name: scheme.name });
                      toast({
                        title: "Application Submitted",
                        description: `Your application for ${scheme.name} is being processed.`,
                      });
                    }}
                    className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20"
                  >
                    Apply for this Scheme <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {/* Only show "Check Eligibility" if the user is in Information Mode */}
                {!isResultsPage && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onClose();
                      navigate("/check");
                    }}
                    className="w-full py-4 text-primary font-bold hover:bg-primary/5"
                  >
                    Check Eligibility First <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SchemeModal;