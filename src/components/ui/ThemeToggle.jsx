import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useThemeContext } from "@/context/ThemeProvider";

export const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full p-1 ${
        isDark ? "bg-accent" : "bg-primary"
      } ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark ? "bg-accent-foreground" : "bg-primary-foreground"
        }`}
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
      <motion.div initial={false} animate={{ rotate: isDark ? 360 : 0 }} transition={{ duration: 0.5 }} > 
        {isDark ? ( <Moon size={14} className="text-accent" /> ) : ( <Sun size={14} className="text-primary" /> )} 
        </motion.div> </motion.div> {/* Background icons */} 
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"> 
          <Sun size={12} className={`transition-opacity ${
        isDark ? "opacity-30" : "opacity-0"}`} /> 
        <Moon size={12} 
        className={`transition-opacity ${isDark ? "opacity-0" : "opacity-30"}`} /> 
        </div>
         </motion.button>
          ); 
        };
