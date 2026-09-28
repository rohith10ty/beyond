import { useState, useRef, useEffect, Suspense } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, Pause, Play, Compass, ChevronDown } from "lucide-react";
import { PlanetCanvas, createMotion } from "@/components/ui/orbit-delivery-hero";

const MagneticWrapper = ({ children, className = "", onClick, strength = 0.35 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const motionRef = useRef(createMotion());
  const interactionRef = useRef(null);
  const dragRef = useRef(null);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = () => setReduced(query.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  const release = (id) => {
    if (dragRef.current?.id !== id) return;
    dragRef.current = null;
    motionRef.current.dragging = false;
    motionRef.current.lastInteraction = motionRef.current.time;
    setDragging(false);
  };

  const toggleMotion = (e) => {
    e?.stopPropagation();
    const next = !auto;
    setAuto(next);
    const m = motionRef.current;
    m.dragging = false;
    if (
      dragRef.current &&
      interactionRef.current?.hasPointerCapture(dragRef.current.id)
    ) {
      interactionRef.current.releasePointerCapture(dragRef.current.id);
    }
    dragRef.current = null;
    setDragging(false);
    m.planetVelocity = m.pitchVelocity = 0;
    m.dragTarget = m.planetAngle;
    m.pitchTarget = m.pitchAngle;
    if (next) m.lastInteraction = m.time - 4;
  };

  const nudge = (direction) => {
    if (!auto) return;
    motionRef.current.planetVelocity += direction * 0.65;
    motionRef.current.lastInteraction = motionRef.current.time;
  };

  const scrollToAbout = () => {
    const el = document.getElementById("about-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSearch = () => {
    const el = document.getElementById("flight-search-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden text-[#ffffff]">
      {/* HERO CONTAINER */}
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 items-center px-5 pb-6 pt-[96px] sm:px-8 sm:pt-[110px] md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:pt-[70px] xl:px-14">
        {/* LEFT COLUMN: HERO CONTENT WITH HIGH-CONTRAST SHADOWS */}
        <div className="relative z-30 flex flex-col justify-center py-2 sm:py-4">
          {/* MAIN HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[580px] text-[34px] font-semibold leading-[1.0] tracking-[-0.045em] text-[#ffffff] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] sm:text-[48px] sm:leading-[0.96] md:text-[58px] lg:text-[54px] xl:text-[66px] 2xl:text-[74px]"
          >
            The world,
            <br />
            <span className="font-normal text-slate-100 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">within reach.</span>
            <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text font-serif italic text-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
              Fly Beyond.
            </span>
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-3.5 sm:mt-5 max-w-[440px] text-[13px] font-normal leading-[1.6] text-slate-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-[14.5px] xl:text-[15.5px]"
          >
            Experience seamless private air travel curated for distinction. Reserve exclusive cabins, search global routes, and explore iconic destinations effortlessly.
          </motion.p>

          {/* CTA BUTTONS WITH MAGNETIC HOVER */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-5 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5"
          >
            <MagneticWrapper onClick={scrollToSearch}>
              <button className="group flex items-center gap-2.5 sm:gap-3 rounded-full border border-white/30 bg-white px-4.5 sm:px-5 py-[9.5px] sm:py-[11px] text-[12px] sm:text-[12.5px] font-semibold text-[#091524] shadow-[0_10px_30px_rgba(255,255,255,0.25)] transition-all hover:bg-slate-100 hover:shadow-[0_14px_38px_rgba(255,255,255,0.35)]">
                Search flights
                <span className="flex h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] items-center justify-center rounded-full bg-[#091524] text-white transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={11} strokeWidth={2.2} />
                </span>
              </button>
            </MagneticWrapper>

            <MagneticWrapper onClick={scrollToAbout}>
              <button className="flex items-center gap-2 rounded-full border border-white/30 bg-white/[0.12] px-4.5 sm:px-5 py-[9.5px] sm:py-[11px] text-[12px] sm:text-[12.5px] font-bold text-[#060e1a] shadow-[0_8px_25px_rgba(0,0,0,0.15)] backdrop-blur-[12px] transition-all hover:bg-white/25 hover:border-white/50">
                <Compass size={13} className="text-[#060e1a]" />
                Explore destinations
              </button>
            </MagneticWrapper>
          </motion.div>

          {/* METRIC COUNTERS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-8 border-t border-white/20 pt-4 sm:pt-5"
          >
            <div>
              <div className="text-[17px] sm:text-[19px] font-bold text-[#ffffff] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] xl:text-[21px]">500+</div>
              <div className="text-[8.5px] sm:text-[9.5px] font-medium uppercase tracking-[0.16em] text-slate-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">Global Routes</div>
            </div>
            <div className="h-5 sm:h-6 w-px bg-white/20" />
            <div>
              <div className="text-[17px] sm:text-[19px] font-bold text-[#ffffff] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] xl:text-[21px]">99.8%</div>
              <div className="text-[8.5px] sm:text-[9.5px] font-medium uppercase tracking-[0.16em] text-slate-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">On-Time Precision</div>
            </div>
            <div className="h-5 sm:h-6 w-px bg-white/20" />
            <div>
              <div className="text-[17px] sm:text-[19px] font-bold text-[#ffffff] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] xl:text-[21px]">24/7</div>
              <div className="text-[8.5px] sm:text-[9.5px] font-medium uppercase tracking-[0.16em] text-slate-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">Concierge Care</div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3D GLOBE WITH RUNNING COURIER BOY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-[380px] w-full min-h-[320px] items-center justify-center sm:h-[480px] lg:h-[calc(100vh-90px)]"
        >
          {/* AMBIENT BACKLIGHT */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-white/[0.08] blur-[130px]" />

          {/* 3D GLOBE INTERACTION STAGE */}
          <div
            ref={interactionRef}
            tabIndex={0}
            role="group"
            aria-label="Rotate the 3D Beyond globe"
            className={`relative z-10 h-full w-full outline-none select-none ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onPointerDown={(event) => {
              if (!auto || !event.isPrimary || event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
              };
              const m = motionRef.current;
              m.dragTarget = m.planetAngle;
              m.pitchTarget = m.pitchAngle;
              m.dragging = true;
              m.lastInteraction = m.time;
              setDragging(true);
            }}
            onPointerMove={(event) => {
              if (!auto || dragRef.current?.id !== event.pointerId) return;
              const dx = event.clientX - dragRef.current.x;
              const dy = event.clientY - dragRef.current.y;
              const sensitivity =
                5 / Math.max(360, event.currentTarget.clientWidth);
              const m = motionRef.current;
              m.dragTarget = Math.max(
                m.planetAngle - 0.5,
                Math.min(m.planetAngle + 0.5, m.dragTarget + dx * sensitivity),
              );
              m.pitchTarget = Math.max(
                m.pitchAngle - 0.4,
                Math.min(
                  m.pitchAngle + 0.4,
                  m.pitchTarget + dy * sensitivity * 0.7,
                ),
              );
              dragRef.current.x = event.clientX;
              dragRef.current.y = event.clientY;
              m.lastInteraction = m.time;
            }}
            onPointerUp={(event) => release(event.pointerId)}
            onPointerCancel={(event) => release(event.pointerId)}
            onLostPointerCapture={(event) => release(event.pointerId)}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                nudge(event.key === "ArrowRight" ? 1 : -1);
              }
              if (
                auto &&
                (event.key === "ArrowUp" || event.key === "ArrowDown")
              ) {
                event.preventDefault();
                motionRef.current.pitchVelocity +=
                  event.key === "ArrowDown" ? 0.4 : -0.4;
                motionRef.current.lastInteraction = motionRef.current.time;
              }
              if (event.key === " ") {
                event.preventDefault();
                if (!event.repeat) toggleMotion();
              }
            }}
          >
            <Suspense fallback={null}>
              <PlanetCanvas
                motion={motionRef}
                active={true}
                auto={auto}
                reduced={reduced}
                onReady={setReady}
                cameraZoomScale={1}
              />
            </Suspense>

            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-[#06101c]/80 px-4 py-2 text-[11px] font-medium text-slate-200 shadow-xl backdrop-blur-xl">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                  Bringing 3D horizon into orbit…
                </div>
              </div>
            )}
          </div>

          {/* LUXURY AWWWARDS-STYLE MICRO CONTROLS ON THE RIGHT SIDE OF THE GLOBE */}
          <div className="absolute bottom-6 right-2 z-30 sm:bottom-8 sm:right-6 lg:right-8">
            <MagneticWrapper strength={0.25}>
              <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/[0.12] py-2 pl-4 pr-2 shadow-[0_8px_25px_rgba(0,0,0,0.15)] backdrop-blur-[12px]">
                <span className="text-[13.5px] font-semibold tracking-wide text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] whitespace-nowrap sm:text-[14px]">
                  {dragging ? "Rotating globe…" : auto ? "Drag to explore" : "Paused & greeting"}
                </span>

                <button
                  onClick={toggleMotion}
                  className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3.5 py-1 text-[11px] font-bold text-[#060e1a] shadow-sm transition-all hover:bg-white/35"
                  aria-label={auto ? "Pause rotation and greet" : "Resume planet rotation"}
                >
                  {auto ? (
                    <>
                      <Pause size={10} className="fill-[#060e1a] text-[#060e1a]" />
                      <span className="text-[#060e1a]">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={10} className="fill-[#060e1a] text-[#060e1a]" />
                      <span className="text-[#060e1a]">Resume</span>
                    </>
                  )}
                </button>
              </div>
            </MagneticWrapper>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
