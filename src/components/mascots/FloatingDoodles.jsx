import { motion } from "framer-motion";

export const FloatingDoodles = () => {
  const doodles = [
    { x: "5%", y: "10%", delay: 0, type: "star" },
    { x: "90%", y: "15%", delay: 0.5, type: "heart" },
    { x: "15%", y: "80%", delay: 1, type: "coin" },
    { x: "85%", y: "75%", delay: 1.5, type: "cloud" },
    { x: "50%", y: "5%", delay: 2, type: "sparkle" },
    { x: "8%", y: "45%", delay: 0.8, type: "heart" },
    { x: "92%", y: "50%", delay: 1.2, type: "star" },
    { x: "75%", y: "90%", delay: 0.3, type: "coin" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 max-w-full max-h-screen">
      {doodles.map((doodle, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: doodle.x, top: doodle.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.1, 0.8],
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 4,
            delay: doodle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <DoodleShape type={doodle.type} />
        </motion.div>
      ))}
    </div>
  );
};

const DoodleShape = ({ type }) => {
  switch (type) {
    case "star":
      return (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path
            d="M20 2 L24 15 L38 15 L27 24 L31 38 L20 29 L9 38 L13 24 L2 15 L16 15 Z"
            fill="hsl(48 100% 85%)"
            stroke="hsl(48 80% 60%)"
            strokeWidth="2"
          />
        </svg>
      );
    case "heart":
      return (
        <svg width="36" height="36" viewBox="0 0 36 36">
          <path
            d="M18 32 C8 22 2 16 2 10 C2 5 6 2 11 2 C14 2 17 4 18 6 C19 4 22 2 25 2 C30 2 34 5 34 10 C34 16 28 22 18 32 Z"
            fill="hsl(350 100% 86%)"
            stroke="hsl(350 80% 60%)"
            strokeWidth="2"
          />
        </svg>
      );
    case "coin":
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="hsl(48 100% 75%)" stroke="hsl(48 80% 50%)" strokeWidth="2" />
          <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="hsl(48 80% 35%)">$</text>
        </svg>
      );
    case "cloud":
      return (
        <svg width="48" height="32" viewBox="0 0 48 32">
          <path
            d="M12 28 C5 28 2 23 4 18 C2 14 6 10 12 10 C14 4 24 2 30 8 C38 6 46 12 44 20 C48 24 44 28 38 28 Z"
            fill="hsl(200 72% 90%)"
            stroke="hsl(200 60% 70%)"
            strokeWidth="2"
          />
        </svg>
      );
    case "sparkle":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path
            d="M14 0 L16 10 L26 12 L16 14 L14 24 L12 14 L2 12 L12 10 Z"
            fill="hsl(150 65% 82%)"
            stroke="hsl(150 50% 60%)"
            strokeWidth="1.5"
          />
        </svg>
      );
    default:
      return null;
  }
};
