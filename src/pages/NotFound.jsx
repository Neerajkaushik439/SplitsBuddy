import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { BuddyBear } from "@/components/mascots/BuddyBear";
import { CuteButton } from "@/components/ui/CuteButton";
import { CuteCard } from "@/components/ui/CuteCard";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-x-hidden">
      <FloatingDoodles />
      
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6"
        >
          <BuddyBear size={150} mood="thinking" />
        </motion.div>
        
        <CuteCard variant="pink" hoverable={false} className="max-w-md">
          <h1 className="text-6xl font-black text-foreground mb-4">404</h1>
          <p className="text-xl font-bold text-foreground mb-2">Oops! Page not found</p>
          <p className="text-muted-foreground mb-6">
            Looks like this page went on vacation without telling us! 🏖️
          </p>
          <CuteButton variant="secondary" onClick={() => navigate("/")}>
            <Home size={20} />
            Go Home
          </CuteButton>
        </CuteCard>
      </motion.div>
    </div>
  );
};

export default NotFound;