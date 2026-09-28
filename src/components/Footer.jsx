import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Globe, Sparkles, Mail, Send, Compass } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 w-full border-t border-white/15 bg-[#050d18]/90 text-white backdrop-blur-2xl">
      <div className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 md:px-14 lg:px-20 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-14 xl:gap-20">
          
          {/* BRAND COLUMN */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex flex-col">
                <span className="text-[30px] font-bold leading-none tracking-[-0.03em] text-white">
                  Beyond
                </span>
                <span className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.48em] text-white/70">
                  Aviation & Travel
                </span>
              </div>

              <p className="mt-5 max-w-[340px] text-[13px] font-normal leading-relaxed text-slate-300">
                Redefining the standard of global flight and bespoke journeys. Connecting iconic global destinations with unwavering punctuality, signature hospitality, and cutting-edge flagship aircraft.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[11.5px] text-white/60">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>IATA & FAA Certified Operations</span>
            </div>
          </div>

          {/* FLIGHT NETWORK */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.24em] text-white/80">
              Popular Routes
            </h4>
            <ul className="mt-5 space-y-3 text-[13px] text-slate-300">
              <li>
                <button onClick={() => scrollToSection("flight-search-section")} className="hover:text-white transition-colors">
                  New York (JFK) → Tokyo (HND)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("flight-search-section")} className="hover:text-white transition-colors">
                  London (LHR) → Dubai (DXB)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("flight-search-section")} className="hover:text-white transition-colors">
                  Zurich (ZRH) → Paris (CDG)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("flight-search-section")} className="hover:text-white transition-colors">
                  Singapore (SIN) → Sydney (SYD)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("flight-search-section")} className="hover:text-white transition-colors">
                  Dubai (DXB) → Malé (MLE)
                </button>
              </li>
            </ul>
          </div>

          {/* FLEET & EXPERIENCES */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.24em] text-white/80">
              Fleet & Cabins
            </h4>
            <ul className="mt-5 space-y-3 text-[13px] text-slate-300">
              <li>
                <button onClick={() => scrollToSection("jet-experience")} className="hover:text-white transition-colors">
                  Boeing 787-9 Dreamliner
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("jet-experience")} className="hover:text-white transition-colors">
                  Airbus A350-1000 Flagship
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("flight-search-section")} className="hover:text-white transition-colors">
                  First Suite Architecture
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("flight-search-section")} className="hover:text-white transition-colors">
                  Business Club & Lounges
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("about-section")} className="hover:text-white transition-colors">
                  Global Concierge Care
                </button>
              </li>
            </ul>
          </div>

          {/* CONCIERGE DISPATCH NEWSLETTER */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.24em] text-white/80">
              Concierge Dispatch
            </h4>
            <p className="mt-3 text-[12.5px] text-slate-300 leading-relaxed">
              Subscribe to receive exclusive route openings, seasonal cabin upgrades, and bespoke destination itineraries.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[12.5px] text-white placeholder:text-white/40 outline-none focus:border-white/50"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#091524] shadow-md transition-all hover:bg-slate-200"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4 text-[12px] text-white/50">
              <span>© 2026 Beyond Aviation & Travel Inc.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
