import { Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useEffect } from "react";
import { toast } from "sonner";

interface VoiceInputProps {
  isListening?: boolean;
  onToggle?: () => void;
  onResult?: (transcript: string) => void;
  size?: "sm" | "lg";
}

/**
 * VoiceInput Component
 * A purely visual wrapper for the microphone button. 
 * Handles the pulsing animations and error toasts, but passes the actual
 * speech-to-text string up to the parent component via `onResult`.
 */
const VoiceInput = ({ onResult, size = "sm" }: VoiceInputProps) => {
  const isLarge = size === "lg";

  // Connects to the browser's native Web Speech API.
  const { isListening, toggleListening, error } = useSpeechRecognition({
    onResult: (text) => onResult?.(text),
  });

  useEffect(() => {
    if (error) {
      toast.error(`Voice recognition error: ${error}`);
    }
  }, [error]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Pulse rings when listening */}
      <AnimatePresence>
        {isListening && (
          <>
            <motion.div
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`absolute rounded-full bg-primary ${isLarge ? "w-24 h-24" : "w-12 h-12"}`}
            />
            <motion.div
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className={`absolute rounded-full bg-primary ${isLarge ? "w-24 h-24" : "w-12 h-12"}`}
            />
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`relative z-10 rounded-full flex items-center justify-center transition-colors ${
          isListening
            ? "bg-destructive text-destructive-foreground"
            : "hero-gradient text-primary-foreground"
        } ${isLarge ? "w-24 h-24" : "w-12 h-12"}`}
      >
        {isListening ? (
          <MicOff className={isLarge ? "w-10 h-10" : "w-5 h-5"} />
        ) : (
          <Mic className={isLarge ? "w-10 h-10" : "w-5 h-5"} />
        )}
      </motion.button>

      {/* Listening animation bars */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute flex items-center gap-1 ${isLarge ? "-bottom-10" : "-bottom-8"}`}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [8, 16, 8] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
            <span className="ml-2 text-sm text-primary font-medium">Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInput;