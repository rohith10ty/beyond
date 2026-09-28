import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function JetRevealSection() {
  const sectionRef = useRef(null);
  const pinContainerRef = useRef(null);
  const jetContainerRef = useRef(null);
  const jetRef = useRef(null);
  const blueprintRef = useRef(null);
  const scanGlowRef = useRef(null);
  const bgTextLeftRef = useRef(null);
  const bgTextRightRef = useRef(null);
  const specsLeftRef = useRef(null);
  const specsRightRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    const jetContainer = jetContainerRef.current;
    const jet = jetRef.current;
    const blueprint = blueprintRef.current;
    const scanGlow = scanGlowRef.current;
    const bgTextLeft = bgTextLeftRef.current;
    const bgTextRight = bgTextRightRef.current;
    const specsLeft = specsLeftRef.current;
    const specsRight = specsRightRef.current;

    if (!section || !pinContainer || !jetContainer) return;

    const ctx = gsap.context(() => {
      // -------------------------------------------------------------------------
      // INITIAL GPU STATES
      // -------------------------------------------------------------------------
      // Big background text sits centered at z-[5]
      gsap.set([bgTextLeft, bgTextRight], {
        opacity: 0,
        y: 60,
        force3D: true,
      });

      // Flight starts below the viewport at 2.15x scale (z-[20])
      gsap.set(jetContainer, {
        xPercent: -50,
        yPercent: 88,
        scale: 2.15,
        transformOrigin: "50% 12%",
        force3D: true,
      });

      // Jet starts 100% visible, blueprint starts 0% visible
      jet.style.opacity = "1";
      jet.style.maskImage = "none";
      jet.style.webkitMaskImage = "none";

      blueprint.style.opacity = "0";
      blueprint.style.maskImage = "none";
      blueprint.style.webkitMaskImage = "none";

      if (scanGlow) {
        gsap.set(scanGlow, { opacity: 0, top: "0%" });
      }

      // Specs start hidden
      gsap.set([specsLeft, specsRight], {
        opacity: 0,
        pointerEvents: "none",
        force3D: true,
      });

      // -------------------------------------------------------------------------
      // MASTER GSAP TIMELINE (scrub: 0.35s for silky responsive tracking)
      // -------------------------------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "jet-trigger",
          trigger: section,
          start: "top top",
          end: "+=3800",
          pin: true,
          anticipatePin: 1,
          scrub: 0.35,
          fastScrollEnd: true,
        },
      });

      // STAGE 1: Big background text "FLY BEYOND" & "IN LUXURY" appears (0.00 -> 0.14)
      tl.to(
        [bgTextLeft, bgTextRight],
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.14,
        },
        0
      );

      // STAGE 2: Large flight rises from bottom viewport, passing OVER the big text (0.14 -> 0.36)
      tl.to(
        jetContainer,
        {
          yPercent: -64,
          ease: "power1.inOut",
          duration: 0.22,
          force3D: true,
        },
        0.14
      );

      // STAGE 3: Flight zooms out from 2.15x down to 1.0x (0.36 -> 0.54)
      // Note: During 0.14 to 0.54, "FLY BEYOND" & "IN LUXURY" stay 100% visible on screen!
      tl.to(
        jetContainer,
        {
          yPercent: -48,
          scale: 1.0,
          ease: "power1.inOut",
          duration: 0.18,
          force3D: true,
        },
        0.36
      );

      // STAGE 4: ONLY WHEN THE FLIGHT HAS BECOME SMALL (at 0.52 -> 0.60), FLY BEYOND & IN LUXURY fade out
      tl.to(
        [bgTextLeft, bgTextRight],
        {
          opacity: 0,
          y: -25,
          ease: "power2.inOut",
          duration: 0.08,
        },
        0.52
      );

      // STAGE 5: WHILE THE BLUEPRINT IS REVEALING (0.60 -> 0.95), SPECS FADE IN SIMULTANEOUSLY!
      tl.to(
        [specsLeft, specsRight],
        {
          opacity: 1,
          pointerEvents: "auto",
          ease: "power2.out",
          duration: 0.20,
        },
        0.60
      );

      // STAGE 6: SMOKY / FEATHERED SCAN TRANSITIONS FROM 100% FLIGHT TO 100% BLUEPRINT (0.60 -> 0.95)
      const scan = { p: -10 };
      tl.to(
        scan,
        {
          p: 110,
          ease: "power1.inOut",
          duration: 0.35,
          onUpdate: () => {
            const v = scan.p;
            const feather = 10; // 10% soft feathered transition band

            if (v <= 0) {
              // 100% SOLID FLIGHT - ZERO BLUEPRINT, FULL NOSE VISIBLE
              jet.style.opacity = "1";
              jet.style.maskImage = "none";
              jet.style.webkitMaskImage = "none";

              blueprint.style.opacity = "0";
              blueprint.style.maskImage = "none";
              blueprint.style.webkitMaskImage = "none";

              if (scanGlow) scanGlow.style.opacity = "0";
            } else if (v >= 100) {
              // 100% PURE BLUEPRINT - ZERO JET RESIDUAL TAIL/WINGS
              jet.style.opacity = "0";
              jet.style.maskImage = "none";
              jet.style.webkitMaskImage = "none";

              blueprint.style.opacity = "1";
              blueprint.style.maskImage = "none";
              blueprint.style.webkitMaskImage = "none";

              if (scanGlow) scanGlow.style.opacity = "0";
            } else {
              // ACTIVE SCAN IN PROGRESS
              jet.style.opacity = "1";
              blueprint.style.opacity = "1";

              const bpMask = `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(0, v - feather)}%, rgba(0,0,0,0) ${Math.min(100, v + feather)}%, rgba(0,0,0,0) 100%)`;
              blueprint.style.maskImage = bpMask;
              blueprint.style.webkitMaskImage = bpMask;

              const jetMask = `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${Math.max(0, v - feather)}%, rgba(0,0,0,1) ${Math.min(100, v + feather)}%, rgba(0,0,0,1) 100%)`;
              jet.style.maskImage = jetMask;
              jet.style.webkitMaskImage = jetMask;

              if (scanGlow) {
                scanGlow.style.top = `${v}%`;
                scanGlow.style.opacity = "1";
              }
            }
          },
        },
        0.60
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="jet-experience"
      className="jet-reveal-experience relative w-full text-white"
    >
      {/* PINNED FULLSCREEN EXPERIENCE CONTAINER */}
      <div
        ref={pinContainerRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* ============================================================ */}
        {/* PHASE 1: MASSIVE BRAND HEADLINES (RESPONSIVE ON ALL SCREENS) */}
        {/* ============================================================ */}
        <div className="pointer-events-none relative z-[5] mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-3.5 sm:px-8 md:px-12 lg:px-14 xl:px-20">
          {/* LEFT SIDE: FLY BEYOND */}
          <div
            ref={bgTextLeftRef}
            className="max-w-[150px] sm:max-w-[240px] md:max-w-[340px] lg:max-w-[440px] xl:max-w-[500px] select-none text-left"
          >
            <h2
              className="text-[34px] sm:text-[48px] md:text-[62px] lg:text-[92px] xl:text-[120px] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-white"
              style={{ textShadow: "0 4px 35px rgba(0,0,0,0.95), 0 1px 6px rgba(0,0,0,0.98)" }}
            >
              Fly Beyond
            </h2>
            <p
              className="mt-2.5 sm:mt-4 max-w-[145px] sm:max-w-[220px] md:max-w-[340px] text-[11.5px] sm:text-[13px] md:text-[14px] lg:text-[15.5px] xl:text-[16.5px] font-medium leading-snug sm:leading-relaxed text-white"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.95)" }}
            >
              Next-generation global air travel & curated journeys
            </p>
          </div>

          {/* RIGHT SIDE: IN LUXURY & MATCHING SUBTITLE */}
          <div
            ref={bgTextRightRef}
            className="max-w-[150px] sm:max-w-[240px] md:max-w-[340px] lg:max-w-[440px] xl:max-w-[500px] select-none text-right"
          >
            <h2
              className="text-right text-[34px] sm:text-[48px] md:text-[62px] lg:text-[92px] xl:text-[120px] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-white"
              style={{ textShadow: "0 4px 35px rgba(0,0,0,0.95), 0 1px 6px rgba(0,0,0,0.98)" }}
            >
              In Luxury
            </h2>
            <p
              className="mt-2.5 sm:mt-4 ml-auto max-w-[145px] sm:max-w-[220px] md:max-w-[340px] text-[11.5px] sm:text-[13px] md:text-[14px] lg:text-[15.5px] xl:text-[16.5px] font-medium leading-snug sm:leading-relaxed text-white"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.95)" }}
            >
              Engineered for long-haul precision, superior passenger well-being, and seamless worldwide connectivity.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 2 & 3: BOEING SPECIFICATIONS (RESPONSIVE ON ALL SCREENS) */}
        {/* ============================================================ */}
        <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-3.5 sm:px-8 md:px-12 lg:px-14 xl:px-20">
          {/* SPECS LEFT */}
          <div
            ref={specsLeftRef}
            className="w-[150px] sm:w-[220px] md:w-[280px] lg:w-[340px] xl:w-[360px] select-none text-left"
          >
            <div
              className="text-[13px] sm:text-[16px] md:text-[18px] lg:text-[22px] font-medium text-white/80"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
            >
              Boeing
            </div>
            <h2
              className="text-[34px] sm:text-[46px] md:text-[58px] lg:text-[76px] font-extrabold leading-none tracking-[-0.04em] text-white"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.95)" }}
            >
              787-9
            </h2>

            <div className="mt-3 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-5 sm:gap-y-4.5 border-t border-white/25 pt-2.5 sm:pt-5">
              <div>
                <div
                  className="text-[8px] sm:text-[8.5px] lg:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/70"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
                >
                  Operating Range
                </div>
                <div
                  className="mt-0.5 text-[12px] sm:text-[13.5px] lg:text-[15px] font-bold text-white"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
                >
                  14,140 KM
                </div>
              </div>

              <div>
                <div
                  className="text-[8px] sm:text-[8.5px] lg:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/70"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
                >
                  Speed
                </div>
                <div
                  className="mt-0.5 text-[12px] sm:text-[13.5px] lg:text-[15px] font-bold text-white"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
                >
                  Mach 0.85
                </div>
              </div>

              <div>
                <div
                  className="text-[8px] sm:text-[8.5px] lg:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/70"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
                >
                  Capacity
                </div>
                <div
                  className="mt-0.5 text-[12px] sm:text-[13.5px] lg:text-[15px] font-bold text-white"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
                >
                  296 Seats
                </div>
              </div>

              <div>
                <div
                  className="text-[8px] sm:text-[8.5px] lg:text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/70"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
                >
                  Altitude
                </div>
                <div
                  className="mt-0.5 text-[12px] sm:text-[13.5px] lg:text-[15px] font-bold text-white"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
                >
                  43,100 FT
                </div>
              </div>
            </div>

            <div className="hidden sm:block mt-4 border-t border-white/20 pt-3">
              <div
                className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-white/50"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
              >
                Specification
              </div>
              <div
                className="mt-1 flex items-center justify-between text-[11px] font-semibold text-white/90 sm:text-[12px]"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
              >
                <span>Length: 56.0 M</span>
                <span>Width: 5.49 M</span>
                <span>Height: 2.40 M</span>
              </div>
            </div>
          </div>

          {/* SPECS RIGHT */}
          <div
            ref={specsRightRef}
            className="w-[150px] sm:w-[220px] md:w-[280px] lg:w-[320px] xl:w-[340px] select-none text-left"
          >
            <h3
              className="text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-bold tracking-tight text-white leading-tight"
              style={{ textShadow: "0 4px 25px rgba(0,0,0,0.95)" }}
            >
              Ultra-long-range
              <span className="block">Aircraft</span>
            </h3>

            <div className="mt-2.5 sm:mt-4 border-t border-white/25 pt-2 sm:pt-4">
              <div
                className="text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.24em] text-white/80"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
              >
                Global Travel
              </div>
              <p
                className="mt-1.5 sm:mt-3 text-[11.5px] sm:text-[12.5px] lg:text-[13.5px] font-normal leading-snug sm:leading-[1.68] text-slate-100 line-clamp-6 sm:line-clamp-none"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}
              >
                A true time-saving flagship connecting continents with effortless non-stop luxury and whispering cabin serenity.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CENTER STAGE: FLIGHT IN FRONT AT Z-[20]                      */}
        {/* PROPORTIONED TO FIT ENTIRE AIRCRAFT (NOSE TO TAIL)           */}
        {/* ============================================================ */}
        <div
          ref={jetContainerRef}
          className="absolute left-1/2 top-1/2 z-[20] flex h-[54vh] sm:h-[64vh] lg:h-[72vh] w-[90vw] max-w-[680px] items-center justify-center pointer-events-none origin-[50%_12%] will-change-[transform] [transform:translateZ(0)] sm:w-[86vw] xl:max-w-[740px]"
        >
          {/* LAYER 1: INTERIOR CABIN BLUEPRINT */}
          <img
            ref={blueprintRef}
            src="/images/blue-print-2.webp"
            alt="Boeing 787-9 Cabin Blueprint Layout"
            loading="eager"
            decoding="async"
            className="absolute inset-0 m-auto h-full w-auto max-h-[72vh] max-w-full object-contain select-none"
          />

          {/* LAYER 2: SOLID JET EXTERIOR */}
          <img
            ref={jetRef}
            src="/images/jet.webp"
            alt="Beyond Boeing 787-9 Flagship Aircraft"
            loading="eager"
            decoding="async"
            className="absolute inset-0 m-auto h-full w-auto max-h-[72vh] max-w-full object-contain select-none"
          />

          {/* LAYER 3: SOFT SMOKED SCANNER GLOW LEADING EDGE */}
          <div
            ref={scanGlowRef}
            className="pointer-events-none absolute left-0 right-0 h-10 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent blur-md transition-opacity duration-150"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
