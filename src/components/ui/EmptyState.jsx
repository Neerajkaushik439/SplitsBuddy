import { motion } from "framer-motion";
import { PennyPiggy } from "../mascots/PennyPiggy";

export const EmptyState = ({ title, description, action }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center p-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          rotate: [-5, 5, -5],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <PennyPiggy size={120} />
      </motion.div>
      
      <h3 className="mt-6 text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground max-w-sm">{description}</p>
      
      {action && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};
