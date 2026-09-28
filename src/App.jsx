import CloudBackground from "@/components/CloudBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import JetRevealSection from "@/components/JetRevealSection";
import FlightSearch from "@/components/FlightSearch";
import Footer from "@/components/Footer";

const App = () => {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-[#ffffff] selection:bg-[#caa16d] selection:text-[#060914]">
      {/* FIXED FULL-SCREEN WEBGL VOLUMETRIC CLOUD BACKGROUND WITH GSAP SCROLL COLOR INTERPOLATION */}
      <CloudBackground />

      {/* FOREGROUND UI CONTENT SCROLLING NATURALLY */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <AboutSection />
        <JetRevealSection />
        <FlightSearch />
        <Footer />
      </div>
    </main>
  );
};

export default App;
