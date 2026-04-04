import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
import { BuddyBear } from "@/components/mascots/BuddyBear";
import { PennyPiggy } from "@/components/mascots/PennyPiggy";
import { CuteButton } from "@/components/ui/CuteButton";
import { CuteInput } from "@/components/ui/CuteInput";
import { CuteCard } from "@/components/ui/CuteCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authStore } from "@/store/authStore";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, signup, googleLogin } = authStore();
  
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        setIsGoogleLoading(true);
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${credentialResponse.access_token}` },
        }).then(res => res.json());

        if (!userInfo.email.endsWith("@gmail.com")) {
          toast.error("use proper email ❌");
          setIsGoogleLoading(false);
          return;
        }

        const user = await googleLogin({
          email: userInfo.email,
          name: userInfo.name,
          googleId: userInfo.sub
        });
        toast.success(`Welcome, ${user.name}! 🎉`);
        navigate("/dashboard");
      } catch (err) {
        toast.error("Google Login Failed! ❌");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login was unsuccessful! ❌");
    },
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!email.endsWith("@gmail.com")) {
      toast.error("use proper email ❌");
      return;
    }
    try{
      if (isLogin) {
      const user = await login(email, password);
      console.log(user);
      toast.success(`Welcome back, ${user.name}! 🎉`);
    } else {
      await signup({name, email, password});
      toast.success("Account created! Let's split some bills! 💰");
    }
    navigate("/dashboard");
  }catch(err){
    toast.error("Invalid Credentials! ❌");
  };
}

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 overflow-x-hidden relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <FloatingDoodles />
      
      {/* Decorative mascots */}
      <motion.div
        className="absolute left-8 bottom-8 hidden lg:block"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <BuddyBear size={120} mood="happy" />
      </motion.div>
      
      <motion.div
        className="absolute right-8 top-8 hidden lg:block"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <PennyPiggy size={100} hasCoins />
      </motion.div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl font-black text-foreground"
            style={{ fontFamily: "Nunito, sans-serif" }}
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Split<span className="text-secondary">Buddy</span>
          </motion.h1>
          <p className="text-muted-foreground mt-2 text-lg font-bold">
            Split bills with friends, the fun way! ✨
          </p>
        </motion.div>

        {/* Auth Card */}
        <CuteCard variant="default" hoverable={false} className="p-8">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 p-1 bg-muted rounded-full">
            {["Login", "Sign Up"].map((tab, idx) => (
              <motion.button
                key={tab}
                className={`flex-1 py-3 rounded-full font-bold transition-all duration-300 ${
                  (idx === 0 ? isLogin : !isLogin)
                    ? "bg-secondary text-secondary-foreground shadow-cute"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsLogin(idx === 0)}
                whileTap={{ scale: 0.97 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CuteInput
                    label="Your Name"
                    placeholder="Buddy Bear"
                    icon={<User size={20} />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <CuteInput
              label="Email"
              type="email"
              placeholder="buddy@splitbuddy.com"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <CuteInput
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <CuteButton type="submit" variant="secondary" size="lg" className="w-full mt-6">
              <Sparkles size={20} />
              {isLogin ? "Let's Go!" : "Create Account"}
            </CuteButton>
        
          </form>
                    {/* Divider */}
          <div className="flex items-center gap-3 my-6" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
            <div className="flex-1 h-px bg-border" style={{ flex: 1, height: '1px' }} />
            <span className="text-sm text-muted-foreground font-bold">or</span>
            <div className="flex-1 h-px bg-border" style={{ flex: 1, height: '1px' }} />
          </div>
          {/* Google Sign In */}
          <motion.button
            onClick={() => handleGoogleSignIn()}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full border-2 border-border bg-background text-foreground font-bold hover:bg-muted transition-all duration-300 disabled:opacity-50"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isGoogleLoading ? "Signing in..." : "Continue with Google"}
          </motion.button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-secondary font-bold hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up here!" : "Login here!"}
            </button>
          </p>
        </CuteCard>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Made with 💖 for happy bill splitting
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;