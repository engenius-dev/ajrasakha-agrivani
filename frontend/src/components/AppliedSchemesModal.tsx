import React from "react";
import { X, ClipboardList, Clock, CheckCircle, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface AppliedSchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AppliedSchemesModal Component
 * A popup overlay showing the farmer a history of their scheme applications and their current status.
 */
const AppliedSchemesModal: React.FC<AppliedSchemesModalProps> = ({ isOpen, onClose }) => {
  // TODO (Phase 2): Currently, this pulls from the local 'AuthContext' memory.
  // Once the backend is built, this should ideally be an API call:
  // const { data: schemes } = useQuery('appliedSchemes', () => axios.get('/api/users/applications'))
  const { user } = useAuth();
  const schemes = user?.appliedSchemes || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary/5 p-6 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">Applied Schemes</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Track your application status</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Conditional Rendering: Empty State vs Populated List */}
            {schemes.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No Applied Schemes</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  You haven't applied to any schemes yet. Use the search or discovery bar to find and apply for relevant benefits.
                </p>
                <Button onClick={onClose} className="mt-8 rounded-xl px-8 bg-primary">Start Exploring</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {schemes.map((scheme, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl border border-border bg-card/50 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{scheme.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter bg-muted px-1.5 py-0.5 rounded">ID: {scheme.id.slice(0, 8)}</span>
                            <span className="text-[11px] text-muted-foreground font-medium">Applied on {scheme.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0">
                        <div className="flex flex-col items-end">
                          {/* Dynamic Status Badge Colors */}
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            scheme.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                            scheme.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {scheme.status}
                          </span>
                          
                          {/* TODO (Phase 2): Replace hardcoded "Updated 2 days ago" with a real timestamp diff */}
                          <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Updated 2 days ago
                          </span>
                        </div>
                        
                        {/* TODO (Phase 2): Add an actual href or onClick handler to this button to view the application PDF/Details */}
                        <button className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Applications usually take 7-10 working days to process.
            </p>
            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">
              Need Help? Contact Support <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppliedSchemesModal;