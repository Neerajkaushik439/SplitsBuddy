import { motion } from "framer-motion";

export const BuddyBear = ({ className = "", size = 100, mood = "happy" }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Body */}
      <motion.ellipse
        cx="50"
        cy="65"
        rx="30"
        ry="28"
        fill="hsl(48 100% 85%)"
        stroke="hsl(15 32% 22%)"
        strokeWidth="2"
      />
      
      {/* Head */}
      <motion.circle
        cx="50"
        cy="35"
        r="25"
        fill="hsl(48 100% 85%)"
        stroke="hsl(15 32% 22%)"
        strokeWidth="2"
        animate={mood === "excited" ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      />
      
      {/* Ears */}
      <circle cx="30" cy="18" r="10" fill="hsl(48 100% 85%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
      <circle cx="30" cy="18" r="5" fill="hsl(350 100% 86%)" />
      <circle cx="70" cy="18" r="10" fill="hsl(48 100% 85%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
      <circle cx="70" cy="18" r="5" fill="hsl(350 100% 86%)" />
      
      {/* Eyes */}
      <motion.g
        animate={mood === "thinking" ? { y: [-1, 1, -1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <circle cx="42" cy="32" r="4" fill="hsl(15 32% 22%)" />
        <circle cx="58" cy="32" r="4" fill="hsl(15 32% 22%)" />
        <circle cx="43" cy="31" r="1.5" fill="white" />
        <circle cx="59" cy="31" r="1.5" fill="white" />
      </motion.g>
      
      {/* Blush */}
      <ellipse cx="35" cy="40" rx="5" ry="3" fill="hsl(350 100% 86%)" opacity="0.6" />
      <ellipse cx="65" cy="40" rx="5" ry="3" fill="hsl(350 100% 86%)" opacity="0.6" />
      
      {/* Nose */}
      <ellipse cx="50" cy="38" rx="4" ry="3" fill="hsl(15 32% 35%)" />
      
      {/* Mouth — avoid animate={{}} on motion.path; Framer can emit d="undefined" */}
      <motion.path
        fill="none"
        stroke="hsl(15 32% 22%)"
        strokeWidth="2"
        strokeLinecap="round"
        d={
          mood === "happy" || mood === "excited"
            ? "M 44 44 Q 50 50 56 44"
            : "M 44 46 Q 50 44 56 46"
        }
        animate={
          mood === "excited"
            ? {
                d: [
                  "M 44 44 Q 50 50 56 44",
                  "M 44 42 Q 50 52 56 42",
                  "M 44 44 Q 50 50 56 44",
                ],
              }
            : false
        }
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
      
      {/* Arms */}
      <ellipse cx="25" cy="65" rx="8" ry="12" fill="hsl(48 100% 85%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
      <ellipse cx="75" cy="65" rx="8" ry="12" fill="hsl(48 100% 85%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
      
      {/* Belly */}
      <ellipse cx="50" cy="68" rx="15" ry="12" fill="hsl(48 100% 92%)" />
      
      {/* Feet */}
      <ellipse cx="38" cy="90" rx="10" ry="6" fill="hsl(48 100% 85%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
      <ellipse cx="62" cy="90" rx="10" ry="6" fill="hsl(48 100% 85%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
    </motion.svg>
  );
};
