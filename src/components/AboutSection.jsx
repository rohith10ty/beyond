import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OptionWheel from "@/components/ui/OptionWheel";

gsap.registerPlugin(ScrollTrigger);

const statement = "Beyond® is a private aviation operator with over 5,000 missions completed across 150+ countries. Our clients trust us to deliver on time, every time.";

const destinationItems = [
  "Tokyo (HND)",
  "Zurich (ZRH)",
  "Malé (MLE)",
  "Paris (CDG)",
  "Dubai (DXB)",
  "Singapore (SIN)",
  "New York (JFK)",
  "London (LHR)",
  "Sydney (SYD)",
  "Milan (MXP)",
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const wheelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    if (!section || !textContainer) return;

    const words = textContainer.querySelectorAll(".word-span");

    // ScrollTrigger with PINNING: Locks the about section in place while words fill & wheel scrolls smoothly
    const st = ScrollTrigger.create({
      id: "about-trigger",
      trigger: section,
      start: "top top",
      end: "+=1200",
      pin: true,
      anticipatePin: 1,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        // 1. Smooth progressive word illumination
        words.forEach((w, i) => {
          const wordStart = i / words.length;
          const wordEnd = (i + 1) / words.length;
          const factor = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)));
          w.style.color = `rgba(255, 255, 255, ${0.2 + factor * 0.8})`;
          w.style.textShadow = factor > 0.5 ? `0 0 24px rgba(255,255,255,${(factor - 0.5) * 0.6})` : "none";
        });

        // 2. Direct real-time wheel synchronization (no lag, no jumping, instant reverse)
        const targetIdx = progress * (destinationItems.length - 1);
        wheelRef.current?.setImmediate(targetIdx);
      },
    });

    // Initialize to index 0 on start
    wheelRef.current?.setImmediate(0);

    return () => {
      st.kill();
    };
  }, []);

  const scrollToSearch = () => {
    const el = document.getElementById("flight-search-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const words = statement.split(" ");

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-16 sm:px-8 md:px-12 lg:px-16 xl:px-24"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1450px] grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-20">
        {/* LEFT COLUMN: EDITORIAL SCROLL-FILLED STATEMENT (CENTERED ON MOBILE/TABLET, LEFT-ALIGNED ON DESKTOP) */}
        <div className="flex flex-col items-center text-center justify-center lg:items-start lg:text-left">
          {/* LUXURY SECTION BADGE */}
          <div className="mb-3 sm:mb-4 flex items-center justify-center lg:justify-start gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/60">
            <Sparkles size={11} className="text-white" />
            <span>Excellence in Flight</span>
          </div>

          {/* EDITORIAL SCROLL-FILLED STATEMENT */}
          <h2
            ref={textContainerRef}
            className="text-[20px] font-semibold leading-[1.28] tracking-[-0.03em] sm:text-[28px] md:text-[36px] lg:text-[42px] xl:text-[48px] max-w-xl lg:max-w-none"
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="word-span inline-block transition-colors duration-75"
                style={{
                  color: "rgba(255, 255, 255, 0.2)",
                  marginRight: "0.26em",
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* RIGHT COLUMN: PURE FLOATING OPTION WHEEL (CENTERED ON MOBILE/TABLET, RIGHT-ALIGNED ON DESKTOP) */}
        <div className="pointer-events-none touch-pan-y relative flex h-[360px] sm:h-[440px] w-full items-center justify-center overflow-hidden lg:h-[520px]">
          <OptionWheel
            ref={wheelRef}
            items={destinationItems}
            defaultSelected={0}
            textColor="rgba(255, 255, 255, 0.25)"
            activeColor="#ffffff"
            side={isMobile ? "center" : "right"}
            fontSize={isMobile ? 1.75 : 2.5}
            spacing={isMobile ? 1.3 : 1.4}
            curve={isMobile ? 0 : 1.15}
            tilt={isMobile ? 0 : 6.5}
            blur={1.8}
            fade={0.28}
            minOpacity={0.05}
            smoothing={220}
            inset={isMobile ? 0 : 30}
            loop={false}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
