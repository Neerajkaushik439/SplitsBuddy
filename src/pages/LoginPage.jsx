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
import { GoogleLogin } from "@react-oauth/google";

/** Decode Google Sign-In JWT (credential) — avoids OAuth2 token client redirect_uri issues. */
function parseGoogleCredential(credential) {
  const base64Url = credential.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const json = atob(padded);
  return JSON.parse(json);
}

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, signup, googleLogin } = authStore();
  
  const handleGoogleCredential = async (credentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) {
      toast.error("Google Login was unsuccessful! ❌");
      return;
    }
    try {
      setIsGoogleLoading(true);
      const payload = parseGoogleCredential(token);
      const email = payload.email;
      const name = payload.name || email?.split("@")[0] || "User";
      const googleId = payload.sub;

      if (!email || !googleId) {
        toast.error("Google Login Failed! ❌");
        return;
      }
      if (!email.endsWith("@gmail.com")) {
        toast.error("use proper email ❌");
        return;
      }

      const user = await googleLogin({ email, name, googleId });
      toast.success(`Welcome, ${user.name}! 🎉`);
      navigate("/dashboard");
    } catch {
      toast.error("Google Login Failed! ❌");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
          {/* Google Sign In — uses Sign in with Google (ID token), not OAuth2 token client (avoids redirect_uri_mismatch). */}
          <motion.div
            className="w-full flex justify-center"
            style={{ opacity: isGoogleLoading ? 0.6 : 1, pointerEvents: isGoogleLoading ? "none" : "auto" }}
            whileHover={{ scale: isGoogleLoading ? 1 : 1.02 }}
            whileTap={{ scale: isGoogleLoading ? 1 : 0.98 }}
          >
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() => toast.error("Google Login was unsuccessful! ❌")}
              text="continue_with"
              shape="pill"
              theme="outline"
              size="large"
              width="384"
              containerProps={{ className: "w-full flex justify-center" }}
            />
          </motion.div>
          {isGoogleLoading ? (
            <p className="text-center text-sm text-muted-foreground mt-2">Signing in…</p>
          ) : null}

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