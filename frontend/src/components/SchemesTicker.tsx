import { motion } from "framer-motion";

// TODO (Phase 2): This static array should be replaced with a dynamic fetch.
// e.g., const { data: schemes } = useQuery('announcements', () => axios.get('/api/news/ticker'))
// This will allow Swetha to push live updates to the farmers without redeploying the frontend.

/**
 * Mock data for the schemes ticker.
 * Represents recent news and updates related to government schemes.
 */
const schemes = [
  "📢 PM-Kisan Samman Nidhi: 17th Installment released for 9.26 crore farmers!",
  "✨ New: PM-KUSUM Subsidy increased to 60% in Rajasthan & MP.",
  "🌱 Soil Health Card: Online registration open for Krishi Mitras.",
  "🚀 Announced: Kisan Credit Card limit raised for dairy farmers.",
  "💧 Per Drop More Crop: Micro-irrigation equipment subsidy available now."
];

/**
 * SchemesTicker component displays a scrolling marquee of latest scheme updates.
 * Uses framer-motion for smooth, infinite loop animation.
 */
const SchemesTicker = () => {
  return (
    <div className="bg-primary/10 border-b border-primary/20 py-1.5 overflow-hidden whitespace-nowrap sticky top-0 z-50">
      <div className="container relative overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-20 items-center text-xs font-semibold text-primary"
        >
          {/* Repeat list to ensure seamless transition */}
          {[...schemes, ...schemes].map((scheme, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {scheme}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SchemesTicker;
