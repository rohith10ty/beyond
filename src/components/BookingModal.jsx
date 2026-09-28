import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plane,
  CheckCircle2,
  CreditCard,
  User,
  Mail,
  Phone,
  Shield,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  Utensils,
  Download,
  Check,
  QrCode,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function BookingModal({
  isOpen,
  onClose,
  flight,
  origin,
  destination,
  departDate,
  totalPassengers = 1,
}) {
  const [step, setStep] = useState(1); // 1: Select Seat, 2: Passenger Details, 3: Payment, 4: Confirmed
  const [selectedSeat, setSelectedSeat] = useState(""); // Unselected by default
  const [paymentMethod, setPaymentMethod] = useState("card");
  const seatContainerRef = useRef(null);

  const scrollCabin = (direction) => {
    if (seatContainerRef.current) {
      seatContainerRef.current.scrollBy({
        top: direction === "down" ? 120 : -120,
        behavior: "smooth",
      });
    }
  };

  const [passengerDetails, setPassengerDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    passport: "",
    meal: "Imperial Caviar & Dom Pérignon Reserve",
    chauffeurAddress: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState(`BY-${Math.floor(100000 + Math.random() * 900000)}`);

  // ALWAYS RESET TO STEP 1 (SEAT SELECTION) whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedSeat("");
      setIsProcessing(false);
      setBookingRef(`BY-${Math.floor(100000 + Math.random() * 900000)}`);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, flight]);

  if (!isOpen || !flight) return null;

  // Determine if International Widebody vs Domestic / Local
  const isInternational =
    (origin?.country && destination?.country && origin.country !== destination.country) ||
    (flight.aircraft && (flight.aircraft.includes("787") || flight.aircraft.includes("777") || flight.aircraft.includes("350")));

  const baseFare = flight.price * totalPassengers;
  const taxes = 85;
  const safOffset = 45;
  const totalAmount = baseFare + taxes + safOffset;

  const formatTripDate = (dateStr) => {
    if (!dateStr) return "Thu, Oct 15, 2026";
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // ===========================================================================
  // INTERNATIONAL WIDEBODY (BOEING 777-300ER / 787-9) SEAT MAP (9 SEATS / ROW)
  // Matching SeatMaestro Boeing 777-300ER:
  // - First Class (Rows 1-2): 1-2-1 [A] | [D G] | [K]
  // - Business (Rows 6-9): 2-3-2 [A C] | [D F G] | [H K]
  // - Exit Row 11: Emergency Exit & Wings
  // - Economy (Rows 14-32): 3-3-3 [A B C] | [D E F] | [H J K] (9 seats across!)
  // ===========================================================================
  const internationalRows = [
    // FIRST CLASS (1-2-1)
    { row: 1, type: "first", occupied: ["1D", "1K"] },
    { row: 2, type: "first", occupied: ["2A", "2G"] },

    // BUSINESS CLASS (2-3-2)
    { row: 6, type: "business", occupied: ["6A", "6F", "6K"] },
    { row: 7, type: "business", occupied: ["7C", "7D", "7H"] },
    { row: 8, type: "business", occupied: ["8G", "8K"] },
    { row: 9, type: "business", occupied: ["9A", "9D", "9F"] },

    // EXIT ROW
    { isExitRow: true, row: 11, label: "Emergency Exit Doors · Overwing Station" },

    // ECONOMY 3-3-3 (9 SEATS IN A ROW)
    { row: 14, type: "economy", occupied: ["14B", "14E", "14J"] },
    { row: 15, type: "economy", occupied: ["15A", "15D", "15F", "15K"] },
    { row: 16, type: "economy", occupied: ["16C", "16H"] },
    { row: 17, type: "economy", occupied: ["17B", "17E", "17K"] },
    { row: 18, type: "economy", occupied: ["18A", "18D", "18J"] },
    { row: 19, type: "economy", occupied: ["19C", "19F", "19H"] },
    { row: 20, type: "economy", occupied: ["20B", "20E", "20K"] },
    { row: 21, type: "economy", occupied: ["21A", "21D", "21J"] },
    { row: 22, type: "economy", occupied: ["22C", "22F", "22H"] },
    { row: 23, type: "economy", occupied: ["23B", "23E", "23K"] },
    { row: 24, type: "economy", occupied: ["24A", "24D", "24J"] },
    { row: 25, type: "economy", occupied: ["25C", "25F", "25H"] },
    { row: 26, type: "economy", occupied: ["26B", "26E", "26K"] },
    { row: 27, type: "economy", occupied: ["27A", "27D", "27J"] },
    { row: 28, type: "economy", occupied: ["28C", "28F", "28H"] },
  ];

  // ===========================================================================
  // DOMESTIC / LOCAL (AIRBUS A321neo / BOEING 737) SEAT MAP (6 SEATS / ROW)
  // - Business (Rows 1-3): 2-2 [A C] | [D F]
  // - Exit Row 4: Emergency Exit
  // - Economy (Rows 5-22): 3-3 [A B C] | [D E F]
  // ===========================================================================
  const domesticRows = [
    { row: 1, type: "first", occupied: ["1A", "1F"] },
    { row: 2, type: "first", occupied: ["2C", "2D"] },
    { row: 3, type: "first", occupied: ["3A", "3F"] },
    { isExitRow: true, row: 4, label: "Emergency Exit · Wing" },
    { row: 5, type: "economy", occupied: ["5B", "5E"] },
    { row: 6, type: "economy", occupied: ["6A", "6D"] },
    { row: 7, type: "economy", occupied: ["7C", "7F"] },
    { row: 8, type: "economy", occupied: ["8B", "8E"] },
    { row: 9, type: "economy", occupied: ["9A", "9D"] },
    { row: 10, type: "economy", occupied: ["10C", "10F"] },
    { row: 11, type: "economy", occupied: ["11B", "11E"] },
    { row: 12, type: "economy", occupied: ["12A", "12D"] },
    { row: 13, type: "economy", occupied: ["13C", "13F"] },
    { row: 14, type: "economy", occupied: ["14B", "14E"] },
    { row: 15, type: "economy", occupied: ["15A", "15D"] },
    { row: 16, type: "economy", occupied: ["16C", "16F"] },
    { row: 17, type: "economy", occupied: ["17B", "17E"] },
    { row: 18, type: "economy", occupied: ["18A", "18D"] },
  ];

  const activeRows = isInternational ? internationalRows : domesticRows;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
    }, 1000);
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-black/65 text-white shadow-[0_30px_100px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col max-h-[88vh]"
        >
          {/* CLEAN LUXURY HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-3 bg-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#caa16d] text-[#091524] font-bold">
                <Plane size={16} className="-rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] sm:text-[15px] font-bold text-white">
                    {origin?.city || "New Delhi"} ({origin?.code || "DEL"}) → {destination?.city || "Tokyo"} ({destination?.code || "HND"})
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/70">
                    {flight.airline} · {isInternational ? "Boeing 777-300ER (Widebody)" : "Airbus A321neo"}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP COUNTER BADGE */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#caa16d]">
                Step {step} of 4: {step === 1 ? "Select Seat" : step === 2 ? "Passenger Details" : step === 3 ? "Payment" : "Boarding Pass"}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STEP 1: SEAT SELECTOR & YOUR TRIP CARD                       */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="p-4 sm:p-5 overflow-hidden flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* LEFT COLUMN: AIRCRAFT CABIN SEAT MAP (md:col-span-7) */}
              <div className="md:col-span-7 flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.04] p-3 sm:p-4 backdrop-blur-md overflow-hidden">
                {/* NOSE / AIRCRAFT HEADER */}
                <div className="mb-2 text-center text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#caa16d]">
                  NOSE · {isInternational ? "BOEING 777-300ER (9 SEATS PER ROW)" : "AIRBUS A321NEO (6 SEATS PER ROW)"}
                </div>

                {/* COLUMN LETTERS HEADER */}
                {isInternational ? (
                  /* 9-ACROSS COLUMN HEADERS (A B C | D E F | H J K) */
                  <div className="mb-2 flex items-center justify-center gap-1 sm:gap-2 text-[10px] font-bold text-white/80 border-b border-white/10 pb-1 shrink-0">
                    <span className="w-5 text-center text-transparent">#</span>
                    <div className="flex gap-1">
                      <span className="w-5 sm:w-6 text-center">A</span>
                      <span className="w-5 sm:w-6 text-center">B</span>
                      <span className="w-5 sm:w-6 text-center">C</span>
                    </div>
                    <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/30">|</div>
                    <div className="flex gap-1">
                      <span className="w-5 sm:w-6 text-center">D</span>
                      <span className="w-5 sm:w-6 text-center">E</span>
                      <span className="w-5 sm:w-6 text-center">F</span>
                    </div>
                    <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/30">|</div>
                    <div className="flex gap-1">
                      <span className="w-5 sm:w-6 text-center">H</span>
                      <span className="w-5 sm:w-6 text-center">J</span>
                      <span className="w-5 sm:w-6 text-center">K</span>
                    </div>
                  </div>
                ) : (
                  /* 6-ACROSS COLUMN HEADERS (A B C | D E F) */
                  <div className="mb-2 flex items-center justify-center gap-2 sm:gap-3 text-[11px] font-bold text-white/80 border-b border-white/10 pb-1.5 shrink-0">
                    <span className="w-5 text-center text-transparent">#</span>
                    <div className="flex gap-1.5 sm:gap-2">
                      <span className="w-7 sm:w-8 text-center">A</span>
                      <span className="w-7 sm:w-8 text-center">B</span>
                      <span className="w-7 sm:w-8 text-center">C</span>
                    </div>
                    <div className="w-3 sm:w-4 text-center text-[8px] text-white/30">AISLE</div>
                    <div className="flex gap-1.5 sm:gap-2">
                      <span className="w-7 sm:w-8 text-center">D</span>
                      <span className="w-7 sm:w-8 text-center">E</span>
                      <span className="w-7 sm:w-8 text-center">F</span>
                    </div>
                  </div>
                )}

                {/* SCROLLABLE CABIN ROWS (ZERO SCROLLBAR, SMOOTH WHEEL SCROLL) */}
                <div
                  ref={seatContainerRef}
                  data-lenis-prevent="true"
                  data-lenis-prevent-wheel="true"
                  onWheel={(e) => {
                    e.stopPropagation();
                    if (seatContainerRef.current) {
                      seatContainerRef.current.scrollTop += e.deltaY;
                    }
                  }}
                  className="no-scrollbar space-y-1.5 overflow-y-auto max-h-[305px] overscroll-contain touch-pan-y pr-0.5"
                >
                  {activeRows.map((item, idx) => {
                    if (item.isExitRow) {
                      return (
                        <div
                          key={`exit-${idx}`}
                          className="my-1.5 flex items-center justify-between px-2 text-[8.5px] font-bold uppercase tracking-widest text-emerald-400/80 bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20"
                        >
                          <span>🚪 EXIT L1</span>
                          <span className="text-[7.5px] text-emerald-300/60">{item.label}</span>
                          <span>EXIT R1 🚪</span>
                        </div>
                      );
                    }

                    const row = item;

                    if (isInternational) {
                      // ==========================================
                      // 9-ACROSS BOEING 777-300ER RENDERER
                      // ==========================================
                      if (row.type === "first") {
                        // First Suite: 1-2-1 [A] | [D G] | [K]
                        return (
                          <div key={row.row} className="flex items-center justify-center gap-1 sm:gap-2 py-0.5">
                            <span className="w-5 text-center text-[10px] font-mono font-bold text-amber-400/70">
                              {row.row}
                            </span>
                            <div className="flex gap-1">
                              {["A"].map((col) => {
                                const code = `${row.row}${col}`;
                                const isOcc = row.occupied.includes(code);
                                const isCh = selectedSeat === code;
                                return (
                                  <button
                                    key={code}
                                    disabled={isOcc}
                                    type="button"
                                    onClick={() => setSelectedSeat(code)}
                                    className={`h-7 w-12 sm:w-14 rounded-lg text-[10px] font-bold transition-all ${
                                      isCh
                                        ? "bg-sky-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                        : isOcc
                                        ? "bg-amber-950/40 border border-amber-500/20 text-white/20 cursor-not-allowed"
                                        : "bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:bg-amber-500/60 hover:scale-105"
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/20">|</div>
                            <div className="flex gap-1">
                              {["D", "G"].map((col) => {
                                const code = `${row.row}${col}`;
                                const isOcc = row.occupied.includes(code);
                                const isCh = selectedSeat === code;
                                return (
                                  <button
                                    key={code}
                                    disabled={isOcc}
                                    type="button"
                                    onClick={() => setSelectedSeat(code)}
                                    className={`h-7 w-10 sm:w-12 rounded-lg text-[10px] font-bold transition-all ${
                                      isCh
                                        ? "bg-sky-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                        : isOcc
                                        ? "bg-amber-950/40 border border-amber-500/20 text-white/20 cursor-not-allowed"
                                        : "bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:bg-amber-500/60 hover:scale-105"
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/20">|</div>
                            <div className="flex gap-1">
                              {["K"].map((col) => {
                                const code = `${row.row}${col}`;
                                const isOcc = row.occupied.includes(code);
                                const isCh = selectedSeat === code;
                                return (
                                  <button
                                    key={code}
                                    disabled={isOcc}
                                    type="button"
                                    onClick={() => setSelectedSeat(code)}
                                    className={`h-7 w-12 sm:w-14 rounded-lg text-[10px] font-bold transition-all ${
                                      isCh
                                        ? "bg-sky-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                        : isOcc
                                        ? "bg-amber-950/40 border border-amber-500/20 text-white/20 cursor-not-allowed"
                                        : "bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:bg-amber-500/60 hover:scale-105"
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // Business Class: 2-3-2 [A C] | [D F G] | [H K]
                      if (row.type === "business") {
                        return (
                          <div key={row.row} className="flex items-center justify-center gap-1 sm:gap-2">
                            <span className="w-5 text-center text-[10px] font-mono font-bold text-sky-400/70">
                              {row.row}
                            </span>
                            <div className="flex gap-1">
                              {["A", "C"].map((col) => {
                                const code = `${row.row}${col}`;
                                const isOcc = row.occupied.includes(code);
                                const isCh = selectedSeat === code;
                                return (
                                  <button
                                    key={code}
                                    disabled={isOcc}
                                    type="button"
                                    onClick={() => setSelectedSeat(code)}
                                    className={`h-6 w-7 sm:w-8 rounded-md text-[9.5px] font-bold transition-all ${
                                      isCh
                                        ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                        : isOcc
                                        ? "bg-sky-950/60 border border-sky-500/20 text-white/20 cursor-not-allowed"
                                        : "bg-sky-950/40 border border-sky-400/30 text-sky-200 hover:bg-sky-900/60 hover:scale-105"
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/20">|</div>
                            <div className="flex gap-1">
                              {["D", "F", "G"].map((col) => {
                                const code = `${row.row}${col}`;
                                const isOcc = row.occupied.includes(code);
                                const isCh = selectedSeat === code;
                                return (
                                  <button
                                    key={code}
                                    disabled={isOcc}
                                    type="button"
                                    onClick={() => setSelectedSeat(code)}
                                    className={`h-6 w-5 sm:w-6 rounded-md text-[9.5px] font-bold transition-all ${
                                      isCh
                                        ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                        : isOcc
                                        ? "bg-sky-950/60 border border-sky-500/20 text-white/20 cursor-not-allowed"
                                        : "bg-sky-950/40 border border-sky-400/30 text-sky-200 hover:bg-sky-900/60 hover:scale-105"
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/20">|</div>
                            <div className="flex gap-1">
                              {["H", "K"].map((col) => {
                                const code = `${row.row}${col}`;
                                const isOcc = row.occupied.includes(code);
                                const isCh = selectedSeat === code;
                                return (
                                  <button
                                    key={code}
                                    disabled={isOcc}
                                    type="button"
                                    onClick={() => setSelectedSeat(code)}
                                    className={`h-6 w-7 sm:w-8 rounded-md text-[9.5px] font-bold transition-all ${
                                      isCh
                                        ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                        : isOcc
                                        ? "bg-sky-950/60 border border-sky-500/20 text-white/20 cursor-not-allowed"
                                        : "bg-sky-950/40 border border-sky-400/30 text-sky-200 hover:bg-sky-900/60 hover:scale-105"
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // Economy Class: 3-3-3 [A B C] | [D E F] | [H J K] (9 SEATS ACROSS)
                      return (
                        <div key={row.row} className="flex items-center justify-center gap-1 sm:gap-2">
                          <span className="w-5 text-center text-[10px] font-mono font-bold text-white/45">
                            {row.row}
                          </span>
                          <div className="flex gap-1">
                            {["A", "B", "C"].map((col) => {
                              const code = `${row.row}${col}`;
                              const isOcc = row.occupied.includes(code);
                              const isCh = selectedSeat === code;
                              return (
                                <button
                                  key={code}
                                  disabled={isOcc}
                                  type="button"
                                  onClick={() => setSelectedSeat(code)}
                                  className={`h-6 w-5 sm:w-6 rounded-md text-[9px] font-bold transition-all ${
                                    isCh
                                      ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                      : isOcc
                                      ? "bg-white/10 text-white/20 cursor-not-allowed"
                                      : "bg-white text-[#091524] hover:bg-slate-200 hover:scale-105"
                                  }`}
                                >
                                  {col}
                                </button>
                              );
                            })}
                          </div>
                          <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/20">|</div>
                          <div className="flex gap-1">
                            {["D", "E", "F"].map((col) => {
                              const code = `${row.row}${col}`;
                              const isOcc = row.occupied.includes(code);
                              const isCh = selectedSeat === code;
                              return (
                                <button
                                  key={code}
                                  disabled={isOcc}
                                  type="button"
                                  onClick={() => setSelectedSeat(code)}
                                  className={`h-6 w-5 sm:w-6 rounded-md text-[9px] font-bold transition-all ${
                                    isCh
                                      ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                      : isOcc
                                      ? "bg-white/10 text-white/20 cursor-not-allowed"
                                      : "bg-white text-[#091524] hover:bg-slate-200 hover:scale-105"
                                  }`}
                                >
                                  {col}
                                </button>
                              );
                            })}
                          </div>
                          <div className="w-2 sm:w-2.5 text-center text-[7px] text-white/20">|</div>
                          <div className="flex gap-1">
                            {["H", "J", "K"].map((col) => {
                              const code = `${row.row}${col}`;
                              const isOcc = row.occupied.includes(code);
                              const isCh = selectedSeat === code;
                              return (
                                <button
                                  key={code}
                                  disabled={isOcc}
                                  type="button"
                                  onClick={() => setSelectedSeat(code)}
                                  className={`h-6 w-5 sm:w-6 rounded-md text-[9px] font-bold transition-all ${
                                    isCh
                                      ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                      : isOcc
                                      ? "bg-white/10 text-white/20 cursor-not-allowed"
                                      : "bg-white text-[#091524] hover:bg-slate-200 hover:scale-105"
                                  }`}
                                >
                                  {col}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    // ==========================================
                    // 6-ACROSS DOMESTIC (A321neo / 737) RENDERER
                    // ==========================================
                    return (
                      <div key={row.row} className="flex items-center justify-center gap-2 sm:gap-3">
                        <span className="w-5 text-center text-[10.5px] font-mono font-bold text-white/50">
                          {row.row}
                        </span>
                        <div className="flex gap-1.5 sm:gap-2">
                          {["A", "B", "C"].map((col) => {
                            const code = `${row.row}${col}`;
                            const isOcc = row.occupied.includes(code);
                            const isCh = selectedSeat === code;
                            return (
                              <button
                                key={code}
                                disabled={isOcc}
                                type="button"
                                onClick={() => setSelectedSeat(code)}
                                className={`h-7 w-7 sm:h-7 sm:w-8 rounded-lg text-[10.5px] font-bold transition-all ${
                                  isCh
                                    ? "bg-sky-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                    : isOcc
                                    ? row.type === "first"
                                      ? "bg-amber-950/40 border border-amber-500/20 text-white/20 cursor-not-allowed"
                                      : "bg-white/10 text-white/20 cursor-not-allowed"
                                    : row.type === "first"
                                    ? "bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:bg-amber-500/60 hover:scale-105"
                                    : "bg-white text-[#091524] hover:bg-slate-200 hover:scale-105"
                                }`}
                              >
                                {col}
                              </button>
                            );
                          })}
                        </div>
                        <div className="w-3 sm:w-4 text-center text-[7.5px] font-bold text-white/20">|</div>
                        <div className="flex gap-1.5 sm:gap-2">
                          {["D", "E", "F"].map((col) => {
                            const code = `${row.row}${col}`;
                            const isOcc = row.occupied.includes(code);
                            const isCh = selectedSeat === code;
                            return (
                              <button
                                key={code}
                                disabled={isOcc}
                                type="button"
                                onClick={() => setSelectedSeat(code)}
                                className={`h-7 w-7 sm:h-7 sm:w-8 rounded-lg text-[10.5px] font-bold transition-all ${
                                  isCh
                                    ? "bg-sky-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.9)] scale-105 border border-white"
                                    : isOcc
                                    ? row.type === "first"
                                      ? "bg-amber-950/40 border border-amber-500/20 text-white/20 cursor-not-allowed"
                                      : "bg-white/10 text-white/20 cursor-not-allowed"
                                    : row.type === "first"
                                    ? "bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:bg-amber-500/60 hover:scale-105"
                                    : "bg-white text-[#091524] hover:bg-slate-200 hover:scale-105"
                                }`}
                              >
                                {col}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM LEGEND & SCROLL HINT */}
                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 text-[9.5px] text-white/70 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-sm bg-amber-500/40 border border-amber-400/50" /> First
                    </span>
                    {isInternational && (
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-sm bg-sky-950 border border-sky-400/40" /> Business
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-sm bg-white" /> Economy
                    </span>
                  </div>
                  
                  {/* QUICK SCROLL UP / DOWN BUTTONS */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scrollCabin("up")}
                      title="Scroll Up"
                      className="flex h-5 w-5 items-center justify-center rounded border border-white/15 bg-white/10 text-white/70 hover:bg-white/25 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCabin("down")}
                      title="Scroll Down"
                      className="flex h-5 w-5 items-center justify-center rounded border border-white/15 bg-white/10 text-white/70 hover:bg-white/25 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronDown size={11} />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: YOUR TRIP SUMMARY CARD (md:col-span-5) */}
              <div className="md:col-span-5 flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.06] p-4 sm:p-5 backdrop-blur-xl shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-sky-400">
                      YOUR TRIP
                    </span>
                    <span className="text-[10px] text-white/60">{flight.type}</span>
                  </div>

                  {/* ROUTE */}
                  <div>
                    <h2 className="text-[20px] font-bold text-white tracking-tight">
                      {origin?.code || "DEL"} → {destination?.code || "HND"}
                    </h2>
                    <p className="text-[12px] text-white/70">{formatTripDate(departDate)}</p>
                  </div>

                  {/* SPECS LIST */}
                  <div className="space-y-1.5 border-t border-b border-white/10 py-2.5 text-[12.5px]">
                    <div className="flex justify-between">
                      <span className="text-white/60">Flight</span>
                      <span className="font-semibold text-white">{flight.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Departure</span>
                      <span className="font-semibold text-white">{flight.departTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Cabin Tier</span>
                      <span className="font-semibold text-white">{flight.cabin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Travellers</span>
                      <span className="font-semibold text-white">{totalPassengers} Guest</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Chosen Seat</span>
                      <span className={`font-bold ${selectedSeat ? "text-sky-400 text-[14px]" : "text-amber-300/80 italic text-[11.5px]"}`}>
                        {selectedSeat ? `Seat ${selectedSeat}` : "Please pick a seat 💺"}
                      </span>
                    </div>
                  </div>

                  {/* TOTAL PRICE */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[12.5px] font-bold uppercase tracking-wider text-white/80">TOTAL</span>
                    <span className="text-[22px] font-black text-sky-400">${flight.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-[12.5px] font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!selectedSeat}
                    onClick={() => setStep(2)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-sky-400 transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>{selectedSeat ? "Passenger Details" : "Select a Seat"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: PASSENGER DETAILS FORM                               */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="mb-3">
                  <h3 className="text-[17px] font-bold text-white">Passenger & Concierge Details</h3>
                  <p className="text-[12px] text-white/70">
                    Seat {selectedSeat} · {flight.airline} ({flight.id})
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2 rounded-2xl border border-white/15 bg-white/5 p-3.5">
                    <div>
                      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        Primary Passenger Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lord Alexander Sterling"
                        value={passengerDetails.fullName}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, fullName: e.target.value })}
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] text-white placeholder-white/40 outline-none focus:border-white/50"
                      />
                    </div>

                    <div>
                      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        Passport / National ID Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. X82941094"
                        value={passengerDetails.passport}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, passport: e.target.value })}
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] text-white placeholder-white/40 outline-none focus:border-white/50"
                      />
                    </div>

                    <div>
                      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        Email Address (Boarding Pass & Itinerary)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alexander@sterling.luxury"
                        value={passengerDetails.email}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] text-white placeholder-white/40 outline-none focus:border-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-white/15 bg-white/5 p-3.5">
                    <div>
                      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        Complimentary Dining Selection
                      </label>
                      <select
                        value={passengerDetails.meal}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, meal: e.target.value })}
                        className="w-full rounded-xl border border-white/20 bg-black/60 py-1.5 px-3 text-[12px] text-white outline-none focus:border-white/50"
                      >
                        <option value="Imperial Caviar & Dom Pérignon Reserve">Imperial Caviar & Dom Pérignon Reserve</option>
                        <option value="A5 Miyazaki Wagyu & Bordeaux Premier Cru">A5 Miyazaki Wagyu & Bordeaux Premier Cru</option>
                        <option value="Michelin Multi-Course Plant-Based">Michelin Multi-Course Plant-Based</option>
                        <option value="Royal Halal Gourmet Selection">Royal Halal Gourmet Selection</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        VIP Chauffeur Pick-Up Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 100 Beverly Hills Blvd, Villa 4"
                        value={passengerDetails.chauffeurAddress}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, chauffeurAddress: e.target.value })}
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] text-white placeholder-white/40 outline-none focus:border-white/50"
                      />
                    </div>

                    <div>
                      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        Mobile Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +1 (555) 839-2049"
                        value={passengerDetails.phone}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value })}
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] text-white placeholder-white/40 outline-none focus:border-white/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2.5 shrink-0 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Seats</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 py-2 text-[13px] font-bold text-white shadow-md hover:bg-sky-400 transition-all active:scale-98"
                >
                  <span>Proceed to Payment (${totalAmount.toLocaleString()})</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: PAYMENT GATEWAY                                      */}
          {/* ============================================================ */}
          {step === 3 && (
            <form onSubmit={handlePaymentSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-[17px] font-bold text-white">Payment & Authorization</h3>
                    <p className="text-[12px] text-white/70">256-bit encrypted charter vault</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    <Lock size={10} />
                    <span>TLS 1.3</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* LEFT: METHOD & PREVIEW */}
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/15 bg-white/5 p-0.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`rounded-lg py-1 text-[11px] font-bold transition-all ${
                          paymentMethod === "card" ? "bg-sky-500 text-white" : "text-white/70 hover:text-white"
                        }`}
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("apple")}
                        className={`rounded-lg py-1 text-[11px] font-bold transition-all ${
                          paymentMethod === "apple" ? "bg-sky-500 text-white" : "text-white/70 hover:text-white"
                        }`}
                      >
                         Apple Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("google")}
                        className={`rounded-lg py-1 text-[11px] font-bold transition-all ${
                          paymentMethod === "google" ? "bg-sky-500 text-white" : "text-white/70 hover:text-white"
                        }`}
                      >
                        Google Pay
                      </button>
                    </div>

                    <div className="relative mx-auto h-36 w-full rounded-2xl border border-amber-400/40 bg-gradient-to-tr from-black/80 via-[#0e1f38]/80 to-[#1b3a66]/80 p-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-black tracking-[0.2em] text-[#caa16d]">BEYOND RESERVE</span>
                        <span className="text-[8px] font-bold text-amber-200 border border-amber-400/30 px-1.5 py-0.5 rounded">
                          CHIP
                        </span>
                      </div>
                      <div className="text-[15px] font-mono font-bold tracking-widest text-white">
                        {paymentDetails.cardNumber || "4532 •••• •••• 8921"}
                      </div>
                      <div className="flex justify-between text-[10px] text-white/80">
                        <span>{paymentDetails.cardholder || passengerDetails.fullName || "CARDHOLDER"}</span>
                        <span>{paymentDetails.expiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: CARD INPUTS & TOTAL */}
                  <div className="space-y-2">
                    <div>
                      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="4532 8920 1849 8921"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] font-mono text-white placeholder-white/40 outline-none focus:border-white/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                          Expires (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="09/29"
                          value={paymentDetails.expiry}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                          className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] font-mono text-white placeholder-white/40 outline-none focus:border-white/50"
                        />
                      </div>
                      <div>
                        <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                          Security CVV
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="892"
                          value={paymentDetails.cvv}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                          className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 px-3 text-[12.5px] font-mono text-white placeholder-white/40 outline-none focus:border-white/50"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-[11.5px] space-y-1">
                      <div className="flex justify-between text-white/70">
                        <span>Airfare (Seat {selectedSeat})</span>
                        <span className="font-semibold text-white">${baseFare.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Airport Taxes & Security Fees</span>
                        <span className="font-semibold text-white">${taxes + safOffset}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-1 text-[13.5px] font-bold text-white">
                        <span>Total Authorization</span>
                        <span className="text-sky-400">${totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2.5 shrink-0 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 py-2 text-[13px] font-bold text-white shadow-md hover:bg-sky-400 transition-all active:scale-98 disabled:opacity-75"
                >
                  {isProcessing ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Authorize & Pay ${totalAmount.toLocaleString()}</span>
                      <CheckCircle2 size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 4: SWEET SUCCESS CONFIRMATION & BOARDING PASS           */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col justify-between text-center space-y-3">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  <CheckCircle2 size={28} />
                </motion.div>

                <h2 className="text-[20px] font-bold text-white">Booking Confirmed!</h2>
                <p className="text-[12px] text-slate-300">
                  Welcome aboard, <span className="font-semibold text-white">{passengerDetails.fullName || "Valued Guest"}</span>.
                </p>

                {/* BOARDING PASS */}
                <div className="relative mx-auto mt-3 max-w-md overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-white/10 to-black/50 p-4 text-left shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[11px] font-black tracking-widest text-[#caa16d]">BEYOND BOARDING PASS</span>
                    <span className="text-[10px] font-mono text-white/70">REF: {bookingRef}</span>
                  </div>

                  <div className="my-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[20px] font-black text-white">{origin?.code || "DEL"}</div>
                      <div className="text-[10.5px] text-white/70">{origin?.city}</div>
                    </div>
                    <Plane size={15} className="text-sky-400 rotate-90" />
                    <div className="text-right">
                      <div className="text-[20px] font-black text-white">{destination?.code || "HND"}</div>
                      <div className="text-[10.5px] text-white/70">{destination?.city}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 border-t border-b border-white/10 py-2 text-center text-[11px]">
                    <div>
                      <div className="text-[8px] uppercase text-white/50">Flight</div>
                      <div className="font-bold text-white">{flight.id}</div>
                    </div>
                    <div>
                      <div className="text-[8px] uppercase text-white/50">Seat</div>
                      <div className="font-black text-sky-400">{selectedSeat}</div>
                    </div>
                    <div>
                      <div className="text-[8px] uppercase text-white/50">Gate</div>
                      <div className="font-bold text-white">VIP 1</div>
                    </div>
                    <div>
                      <div className="text-[8px] uppercase text-white/50">Time</div>
                      <div className="font-bold text-white">{flight.departTime}</div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-white/50">Passenger</div>
                      <div className="text-[12px] font-bold text-white">{passengerDetails.fullName || "Valued Guest"}</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 text-[#091524]">
                      <QrCode size={32} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 justify-center shrink-0 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => alert("Boarding pass PDF downloaded with scannable QR code!")}
                  className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  <Download size={13} />
                  <span>Download Ticket</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-sky-500 px-6 py-2 text-[12px] font-bold text-white shadow-md hover:bg-sky-400 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
