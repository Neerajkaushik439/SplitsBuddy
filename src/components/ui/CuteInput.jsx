import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, useState, createElement, isValidElement } from "react";

const CuteInput = forwardRef(
  ({ className, label, icon: Icon, error, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-sm font-bold text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
             {isValidElement(Icon) ? Icon : <Icon size={18} />}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full px-5 py-3 rounded-2xl bg-card border-2 border-border",
              "font-nunito text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20",
              "transition-all duration-300",
              isFocused && "scale-[1.01]",
              Icon && "pl-12",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
            style={{
              width: '100%',
              padding: Icon ? '0.75rem 1.25rem 0.75rem 3rem' : '0.75rem 1.25rem',
              borderRadius: '1rem',
              borderWidth: '2px',
              borderStyle: 'solid',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            className="mt-2 text-sm text-destructive"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

CuteInput.displayName = "CuteInput";

export { CuteInput };
