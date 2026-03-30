import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

// TODO (Phase 2): DELETE this entire mock dictionary once the Express backend is ready.
// The backend will handle the RAG search against Harini's expert data.
/**
 * Mock responses for the AgriVani assistant.
 * Contains predefined answers for common scheme-related keywords.
 */
const mockResponses: Record<string, string> = {
  default:
    "I can help you check scheme eligibility. Try asking about PM-Kisan, PM-KUSUM, or soil health cards!",
  "pm-kisan":
    "The 'PM-KISAN' scheme provides ₹6,000/year to small and marginal farmers. You usually need Aadhaar and land records to apply.",
  "pm-kusum":
    "The 'PM-KUSUM' scheme helps you install solar pumps with massive subsidies. It's great for reducing electricity bills!",
  "soil":
    "The 'Soil Health Card' scheme helps you understand your soil's nutrient status so you can use the right amount of fertilizer.",
};

// TODO (Phase 2): DELETE this function entirely. The Express backend will generate dynamic responses based on the user's query
// and the RAG search results.
/**
 * Simple keyword matching function to determine the AI's response.
 * @param input - The user's input string.
 * @returns The matching response or a default message.
 */
const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("kisan")) return mockResponses["pm-kisan"];
  if (lower.includes("kusum")) return mockResponses["pm-kusum"];
  if (lower.includes("soil")) return mockResponses["soil"];
  return mockResponses.default;
};

/**
 * ChatWidget Component
 * A persistent floating AI assistant. Currently uses mock heuristic responses.
 * Supports basic interactivity with mock responses and smooth scrolling.
 * Will be wired to the Express/Gemini RAG pipeline to answer complex scheme queries.
 */
const ChatWidget = () => {
  // --- UI State ---
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Namaste! 🙏 I am your AgriVani assistant. How can I help you today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- Side Effects ---
  // Automatically scroll to the bottom when new messages arrive or while typing
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /**
   * Handles sending messages.
   * Updates state with user message and triggers a delayed mock response.
   * Currently uses a setTimeout to simulate network latency.
   */
  const send = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // TODO (Phase 2): Replace this setTimeout with a real API Call
    /* EXAMPLE INTEGRATION:
    try {
      const response = await axios.post('/api/chat', { 
        message: userMsg.text,
        // Optional: Pass context like the farmer's state/landSize here so Gemini knows who it's talking to
      });
      
      const aiMsg: Message = { id: Date.now() + 1, text: response.data.reply, sender: "ai" };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      // Handle error visually
    } finally {
      setIsTyping(false);
    }
    */

    // --- TEMPORARY MOCK LOGIC ---
    setTimeout(() => {
      const aiMsg: Message = { id: Date.now() + 1, text: getResponse(input), sender: "ai" };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // UI Render code remains exactly the same. The button toggles the chat window, and the chat window displays messages and an 
  // input field.
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full hero-gradient text-primary-foreground flex items-center justify-center shadow-2xl ring-4 ring-white/10"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[32rem] rounded-3xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="hero-gradient px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-primary-foreground">AgriVani Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-primary-foreground/80 uppercase tracking-widest font-bold">Online</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.sender === "user" ? "bg-primary/10" : "bg-secondary/10"}`}>
                    {m.sender === "user" ? <User className="w-4 h-4 text-primary" /> : <Sparkles className="w-4 h-4 text-secondary" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none border border-border/50"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="flex gap-2 bg-background border border-border rounded-xl p-1.5 shadow-sm">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
