import { useState, useEffect } from "react";
import Navbar from "./assets/secciones/navbar/Navbar";
import Hero from "./assets/secciones/hero/Hero";
import About from "./assets/secciones/about/About";
import WorkExperience from "./assets/secciones/WorkExperience/WorkExperience";
import "./App.css";

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`app ${mounted ? "mounted" : ""}`}>
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <WorkExperience />
      </main>
    </div>
  );
}

export default App;