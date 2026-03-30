import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

/**
 * ThemeToggle Component
 * A highly polished, animated dropdown button that allows the user to switch 
 * between Light, Dark, and System themes. 
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* asChild allows the DropdownMenuTrigger to pass its click events 
            down to our custom Button component seamlessly */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group overflow-hidden border border-transparent hover:border-primary/20"
        >
          <div className="relative w-5 h-5">
            {/* mode="wait" ensures the current icon completely finishes its 'exit' 
                animation before the new icon begins its 'initial' animation */}
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.div
                  key="sun"
                  initial={{ y: 20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : theme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ y: 20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="system"
                  initial={{ y: 20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Laptop className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="bg-card border-border rounded-2xl p-1.5 shadow-2xl min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 p-2 rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer transition-colors"
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 p-2 rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer transition-colors"
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 p-2 rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer transition-colors"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}