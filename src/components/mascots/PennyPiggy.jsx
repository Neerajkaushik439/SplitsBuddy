import { motion } from "framer-motion";

export const PennyPiggy = ({ className = "", size = 100, hasCoins = false }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Body */}
      <motion.ellipse
        cx="50"
        cy="55"
        rx="35"
        ry="30"
        fill="hsl(350 100% 86%)"
        stroke="hsl(15 32% 22%)"
        strokeWidth="2"
        animate={{ scaleY: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      
      {/* Coin Slot */}
      <rect x="42" y="28" width="16" height="4" rx="2" fill="hsl(15 32% 22%)" />
      
      {/* Ears */}
      <motion.path
        d="M 25 35 Q 15 25 25 20 Q 32 22 30 32"
        fill="hsl(350 100% 86%)"
        stroke="hsl(15 32% 22%)"
        strokeWidth="2"
        animate={{ rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ transformOrigin: "27px 30px" }}
      />
      <motion.path
        d="M 75 35 Q 85 25 75 20 Q 68 22 70 32"
        fill="hsl(350 100% 86%)"
        stroke="hsl(15 32% 22%)"
        strokeWidth="2"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ transformOrigin: "73px 30px" }}
      />
      
      {/* Face / Snout */}
      <ellipse cx="50" cy="55" rx="18" ry="15" fill="hsl(350 100% 90%)" />
      
      {/* Nostrils */}
      <circle cx="45" cy="58" r="3" fill="hsl(350 70% 70%)" />
      <circle cx="55" cy="58" r="3" fill="hsl(350 70% 70%)" />
      
      {/* Eyes */}
      <circle cx="38" cy="45" r="5" fill="hsl(15 32% 22%)" />
      <circle cx="62" cy="45" r="5" fill="hsl(15 32% 22%)" />
      <circle cx="39" cy="44" r="2" fill="white" />
      <circle cx="63" cy="44" r="2" fill="white" />
      
      {/* Blush */}
      <ellipse cx="30" cy="52" rx="6" ry="4" fill="hsl(350 100% 80%)" opacity="0.5" />
      <ellipse cx="70" cy="52" rx="6" ry="4" fill="hsl(350 100% 80%)" opacity="0.5" />
      
      {/* Smile */}
      <path
        d="M 42 65 Q 50 72 58 65"
        fill="none"
        stroke="hsl(15 32% 22%)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Legs */}
      <ellipse cx="30" cy="82" rx="8" ry="10" fill="hsl(350 100% 86%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
      <ellipse cx="70" cy="82" rx="8" ry="10" fill="hsl(350 100% 86%)" stroke="hsl(15 32% 22%)" strokeWidth="2" />
      
      {/* Hooves */}
      <ellipse cx="30" cy="88" rx="6" ry="4" fill="hsl(350 70% 70%)" />
      <ellipse cx="70" cy="88" rx="6" ry="4" fill="hsl(350 70% 70%)" />
      
      {/* Tail — static path avoids Framer interpolating d to undefined */}
      <path
        d="M 85 55 Q 95 50 92 60 Q 88 65 93 70"
        fill="none"
        stroke="hsl(350 100% 86%)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Floating Coins */}
      {hasCoins && (
        <>
          <motion.g
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          >
            <circle cx="15" cy="30" r="8" fill="hsl(48 100% 70%)" stroke="hsl(48 80% 50%)" strokeWidth="2" />
            <text x="15" y="34" textAnchor="middle" fontSize="10" fill="hsl(48 80% 40%)">$</text>
          </motion.g>
          <motion.g
            animate={{ y: [0, -12, 0], rotate: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
          >
            <circle cx="85" cy="25" r="6" fill="hsl(48 100% 70%)" stroke="hsl(48 80% 50%)" strokeWidth="2" />
            <text x="85" y="28" textAnchor="middle" fontSize="8" fill="hsl(48 80% 40%)">$</text>
          </motion.g>
        </>
      )}
    </motion.svg>
  );
};
