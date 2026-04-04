import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const CuteTag = ({ children, variant = "pink", removable = false, onRemove, className }) => {
  const variants = {
    pink: "bg-secondary text-secondary-foreground",
    blue: "bg-accent text-accent-foreground",
    mint: "bg-mint text-mint-foreground",
    yellow: "bg-primary text-primary-foreground",
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold",
        variants[variant],
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.05 }}
      layout
    >
      {children}
      {removable && (
        <motion.button
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={14} />
        </motion.button>
      )}
    </motion.span>
  );
};

export { CuteTag };
