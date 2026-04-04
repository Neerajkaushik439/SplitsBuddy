import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const CuteButton = forwardRef(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-nunito font-bold rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-cute";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:shadow-float",
      secondary: "bg-secondary text-secondary-foreground hover:shadow-float",
      accent: "bg-accent text-accent-foreground hover:shadow-float",
      mint: "bg-mint text-mint-foreground hover:shadow-float",
      outline: "border-2 border-primary bg-transparent text-foreground hover:bg-primary/10",
      ghost: "bg-transparent hover:bg-muted text-foreground shadow-none",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

CuteButton.displayName = "CuteButton";

export { CuteButton };
