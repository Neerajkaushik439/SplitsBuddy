import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CuteCard = ({ 
  children, 
  className, 
  variant = "default",
  hoverable = true,
  onClick
}) => {
  const variants = {
    default: "bg-card border-border",
    pink: "bg-secondary/20 border-secondary/30",
    blue: "bg-accent/20 border-accent/30",
    mint: "bg-mint/20 border-mint/30",
    yellow: "bg-primary/20 border-primary/30",
  };

  return (
    <motion.div
      className={cn(
        "rounded-3xl border-2 p-6 shadow-cute transition-all duration-300",
        variants[variant],
        hoverable && "hover:shadow-float hover:-translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hoverable ? { scale: 1.01 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export { CuteCard };
