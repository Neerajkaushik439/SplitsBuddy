import { motion } from "framer-motion";
import { BuddyBear } from "../mascots/BuddyBear";

export const LoadingMascot = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <motion.div
        animate={{ 
          y: [0, -20, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <BuddyBear size={80} mood="excited" />
      </motion.div>
      
      <motion.div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-secondary"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
      
      <motion.p
        className="text-muted-foreground font-bold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
};
