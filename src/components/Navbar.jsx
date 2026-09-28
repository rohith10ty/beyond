import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X, Plane, Compass, Sparkles, User, LogOut } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AuthModal from "@/components/AuthModal";

const navItems = [
  { name: "About", targetId: "about-section" },
  { name: "Fleet", targetId: "jet-experience" },
  { name: "Flights", targetId: "flight-search-section" },
  { name: "Destinations", targetId: "destinations-section" },
];

const MagneticButton = ({ children, onClick, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft, smooth, luxurious magnetic spring
  const springConfig = { stiffness: 120, damping: 22, mass: 0.7 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.22);
    y.set((clientY - centerY) * 0.22);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  const { scrollY } = useScroll();

  // Scroll transforms for the centered Beyond typography on desktop
  const logoScale = useTransform(scrollY, [0, 180], [2.0, 1.0]);
  const logoTranslateY = useTransform(scrollY, [0, 180], [16, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // If we are at the top/hero home screen, no navlink should be underlined
      const aboutEl = document.getElementById("about-section");
      const aboutTop = aboutEl ? aboutEl.getBoundingClientRect().top + window.scrollY : 600;
      if (window.scrollY + 180 < aboutTop) {
        setActiveTab("");
        return;
      }

      // Dynamic active tab detection based on scroll position
      const scrollPos = window.scrollY + 200;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        if (item.name === "Fleet") {
          const jetTrigger = ScrollTrigger.getById("jet-trigger");
          if (jetTrigger && scrollPos >= jetTrigger.start && scrollPos <= jetTrigger.end) {
            setActiveTab("Fleet");
            break;
          }
        }
        const el = document.getElementById(item.targetId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top - 120) {
            setActiveTab(item.name);
            break;
          }
        }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update screen state and close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (item) => {
    setActiveTab(item.name);
    setIsMobileMenuOpen(false);

    if (item.name === "Fleet") {
      const jetTrigger = ScrollTrigger.getById("jet-trigger");
      let targetScroll = 0;
      if (jetTrigger) {
        targetScroll = jetTrigger.start + (jetTrigger.end - jetTrigger.start) * 0.35;
      } else {
        const el = document.getElementById("jet-experience");
        targetScroll = el ? el.getBoundingClientRect().top + window.scrollY + 1300 : 2400;
      }

      if (window.lenis) {
        window.lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
      return;
    }

    if (item.name === "Destinations") {
      const el = document.getElementById("destinations-section");
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        } else {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
      return;
    }

    if (item.name === "About") {
      const el = document.getElementById("about-section");
      if (el) {
        const aboutTrigger = ScrollTrigger.getById("about-trigger");
        const targetScroll = aboutTrigger ? aboutTrigger.start : el.getBoundingClientRect().top + window.scrollY;
        if (window.lenis) {
          window.lenis.scrollTo(targetScroll, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }
      return;
    }

    if (item.name === "Flights") {
      const el = document.getElementById("flight-search-section");
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: -60, duration: 1.2 });
        } else {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 60;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
      return;
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`fixed left-0 top-0 z-[100] m-0 w-full py-[12px] sm:py-[15px] transition-all duration-300 ease-out ${
          isScrolled || isMobileMenuOpen
            ? "is-scrolled"
            : "border-b border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-2 items-center px-5 sm:px-6 md:px-10 lg:grid-cols-3 xl:px-[40px]">
          {/* LEFT COLUMN: ABOUT, FLEET, FLIGHTS, DESTINATIONS */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`relative py-1 text-[13.5px] font-medium tracking-[0.03em] transition-colors duration-200 ${
                    isActive ? "text-[#ffffff]" : "text-white/70 hover:text-[#ffffff]"
                  }`}
                >
                  <span>{item.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CENTER COLUMN: VERTICALLY STACKED CENTERED TYPOGRAPHY */}
          <div className="flex justify-start lg:justify-center">
            <motion.a
              href="/"
              style={isDesktop ? {
                scale: logoScale,
                y: logoTranslateY,
                transformOrigin: "center top",
              } : {}}
              className="group flex flex-col items-start lg:items-center justify-center text-left lg:text-center will-change-transform"
            >
              {/* "BEYOND" LETTERING */}
              <span className="text-[25px] font-bold leading-none tracking-[-0.035em] text-[#ffffff] transition-colors duration-300 group-hover:text-slate-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)] sm:text-[27px]">
                Beyond
              </span>

              {/* "AVIATION & TRAVEL" */}
              <span className="mt-[4px] text-[8.5px] font-bold uppercase tracking-[0.52em] text-white/80 transition-colors duration-300 group-hover:text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                Aviation & Travel
              </span>
            </motion.a>
          </div>

          {/* RIGHT COLUMN: ACTIONS WITH GENTLE MAGNETIC BUTTON & HAMBURGER */}
          <div className="flex items-center justify-end gap-3.5">
            {currentUser ? (
              <div className="hidden items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1 pl-3 pr-2 text-[12.5px] font-medium text-white backdrop-blur-md sm:flex">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#caa16d] text-[10px] font-bold text-[#091524]">
                  {currentUser.name[0]}
                </span>
                <span className="max-w-[120px] truncate text-white/90">{currentUser.name}</span>
                <button
                  onClick={() => setCurrentUser(null)}
                  title="Sign out"
                  className="rounded-full p-1 text-white/60 hover:bg-white/15 hover:text-white"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="hidden text-[13px] font-medium text-white/80 transition-colors hover:text-white sm:block"
              >
                Sign in
              </button>
            )}

            <MagneticButton
              onClick={() => {
                const el = document.getElementById("flight-search-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group hidden items-center gap-2.5 rounded-full border border-white/30 bg-white px-5 py-[9px] text-[12.5px] font-semibold text-[#091524] shadow-[0_8px_25px_rgba(255,255,255,0.2)] transition-all hover:bg-slate-100 sm:flex"
            >
              <span>Book a flight</span>
              <ArrowUpRight
                size={14}
                strokeWidth={2.2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </MagneticButton>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl border border-white/20 bg-white/[0.12] text-white shadow-lg backdrop-blur-xl transition-all active:scale-95 lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X size={20} strokeWidth={2.2} />
              ) : (
                <Menu size={20} strokeWidth={2.2} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE FULLSCREEN / SLIDE-DOWN NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[70px] z-[99] border-b border-white/15 bg-[#06101c]/95 px-6 pb-8 pt-4 backdrop-blur-2xl lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[16px] font-medium text-white/90 transition-colors hover:bg-white/10 active:bg-white/15"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles size={14} className="text-[#caa16d]" />
                    {item.name}
                  </span>
                  <ArrowUpRight size={16} className="text-white/40" />
                </button>
              ))}

              <div className="my-2 h-px w-full bg-white/10" />

              <div className="flex flex-col gap-3 pt-2">
                {currentUser ? (
                  <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 p-3.5 text-[14px]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#caa16d] font-bold text-[#091524]">
                        {currentUser.name[0]}
                      </span>
                      <span>{currentUser.name}</span>
                    </div>
                    <button
                      onClick={() => setCurrentUser(null)}
                      className="text-[12px] text-white/50 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="w-full rounded-xl py-3 text-center text-[14px] font-medium text-white/80 transition-colors hover:bg-white/10"
                  >
                    Sign in / Sign up
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById("flight-search-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-[14px] font-semibold text-[#091524] shadow-lg active:scale-98"
                >
                  <span>Book a flight</span>
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
};

export default Navbar;

