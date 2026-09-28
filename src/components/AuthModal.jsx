import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, Shield, Eye, EyeOff } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = {
        name: fullName || (email ? email.split("@")[0] : "Alexander Sterling"),
        email: email || "alexander@sterling.luxury",
        tier: "Diamond Voyager",
      };
      setSuccessMessage(
        isSignUp ? "Account created successfully! Welcome to Beyond." : "Welcome back to Beyond."
      );

      setTimeout(() => {
        onLoginSuccess(user);
        setSuccessMessage("");
        onClose();
      }, 900);
    }, 650);
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-[450px] overflow-hidden rounded-3xl border border-white/20 bg-black/60 p-5 sm:p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
        >
          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X size={15} />
          </button>

          {successMessage ? (
            <div className="py-7 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                <CheckCircle2 size={28} />
              </motion.div>
              <h3 className="text-[19px] font-bold text-white">Authenticated</h3>
              <p className="mt-1 text-[12.5px] text-slate-200">{successMessage}</p>
            </div>
          ) : (
            <>
              {/* HEADER BADGE & TITLE */}
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.25em] text-[#caa16d]">
                <Sparkles size={11} />
                <span>Beyond Membership</span>
              </div>

              <h2 className="mt-0.5 text-[21px] sm:text-[23px] font-bold tracking-tight text-white">
                {isSignUp ? "Join Beyond" : "Welcome Back"}
              </h2>
              <p className="text-[12px] text-white/70">
                {isSignUp
                  ? "Priority charter privileges and private suite bookings."
                  : "Access your suite reservations and VIP concierge."}
              </p>

              {/* TABS */}
              <div className="mt-3 grid grid-cols-2 rounded-xl border border-white/15 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`rounded-lg py-1.5 text-[12px] font-semibold transition-all ${
                    !isSignUp ? "bg-white text-[#091524] shadow-md" : "text-white/70 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`rounded-lg py-1.5 text-[12px] font-semibold transition-all ${
                    isSignUp ? "bg-white text-[#091524] shadow-md" : "text-white/70 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="mt-3 space-y-2">
                {isSignUp && (
                  <div>
                    <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Lord Alexander Sterling"
                        className="w-full rounded-xl border border-white/15 bg-white/10 py-1.5 pl-8 pr-3 text-[12.5px] text-white placeholder-white/40 outline-none transition-colors focus:border-white/40 focus:bg-white/15"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@sterling.luxury"
                      className="w-full rounded-xl border border-white/15 bg-white/10 py-1.5 pl-8 pr-3 text-[12.5px] text-white placeholder-white/40 outline-none transition-colors focus:border-white/40 focus:bg-white/15"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-0.5 flex items-center justify-between">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                      Password
                    </label>
                    {!isSignUp && (
                      <button type="button" className="text-[10.5px] font-medium text-white/60 hover:text-white transition-colors">
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-white/15 bg-white/10 py-1.5 pl-8 pr-8 text-[12.5px] text-white placeholder-white/40 outline-none transition-colors focus:border-white/40 focus:bg-white/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-[12.5px] font-bold text-[#091524] shadow-[0_4px_16px_rgba(255,255,255,0.2)] transition-all hover:bg-slate-100 active:scale-98 disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#091524] border-t-transparent" />
                  ) : (
                    <>
                      <span>{isSignUp ? "Create Member Profile" : "Sign In to Cabin"}</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>

              {/* SOCIAL PROVIDERS */}
              <div className="relative my-2.5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative bg-black/40 px-2 text-[9.5px] font-medium uppercase tracking-wider text-white/50 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({ name: "Google Member", email: "guest@google.com", tier: "Diamond Voyager" });
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({ name: "Apple Member", email: "vip@icloud.com", tier: "Diamond Voyager" });
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.06-1.88.94-2.97-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.77-.95 2.83 1.02.08 2.05-.51 2.68-1.23z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] text-white/50">
                <Shield size={11} className="text-emerald-400" />
                <span>256-bit Encrypted Private Vault</span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
