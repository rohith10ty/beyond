import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Lenis from "lenis";

import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";

import "./index.css";
import "./lightswind.css";

import App from "./App.jsx";

function Root() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.9,
      lerp: 0.1,
    });

    window.lenis = lenis;

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
