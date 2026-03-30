import React from "react";
import { X, User, Phone, MapPin, Calendar, Layers, ShieldCheck, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ProfileModal Component
 * A popup overlay that displays the currently logged-in farmer's digital ID card.
 * It pulls data dynamically from the global AuthContext.
 */
const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  // Pulls the current user data from our global memory (AuthContext)
  const { user } = useAuth();

  // Safety check: If the modal is closed OR if there is no user logged in, render nothing.
  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Animated Background Blur Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        {/* Main Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary/5 p-6 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">Farmer Profile</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Verified AgriVani Member</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content: Mapping the User Data */}
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfileField icon={User} label="Full Name" value={user.name} />
              <ProfileField icon={Phone} label="Phone Number" value={`+91 ${user.phone}`} />
              <ProfileField icon={Calendar} label="Age" value={user.age ? `${user.age} Years` : "Not Set"} />
              <ProfileField icon={Layers} label="Land Size" value={user.landSize ? `${user.landSize} Acres` : "Not Set"} />
              <ProfileField icon={MapPin} label="State" value={user.state || "Not Set"} />
              <ProfileField icon={ShieldCheck} label="Category" value={user.category || "Not Set"} />
            </div>

            <div className="pt-4 border-t border-border/50">
              {/* TODO (Phase 2): Wire this button to open a form allowing users to update their details via a PUT request */}
              <Button className="w-full h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground shadow-none font-bold">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile Details
              </Button>
            </div>
          </div>

          <div className="bg-muted/30 p-4 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
              Data synced with Ministry of Agriculture
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * Reusable Sub-Component
 * Extracts the repeated UI pattern for displaying a label, an icon, and a value.
 * FIXED: Replaced 'any' with 'React.ElementType' for strict type safety.
 */
const ProfileField = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-border transition-all group">
    <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border group-hover:text-primary transition-colors">
      <Icon className="w-4.5 h-4.5" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default ProfileModal;