import { useEffect, useRef, useState } from "react";
import "./Hero.css";

const roles = ["Software Engineer.", "UI/UX Designer.", "Problem Solver.", "Creative Dev."];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = roles[roleIndex];

    if (!isDeleting && displayed === current) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
      return;
    }

    const speed = isDeleting ? 50 : 90;
    timeoutRef.current = setTimeout(() => {
      setDisplayed(
        isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1)
      );
    }, speed);

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section id="home" className="hero">
      {/* Avatar bubble */}
      <div className="hero-avatar-area">
        <div className="avatar-speech">
          <span>Hola! yo soy </span>
          <span className="-name">Matias</span>
        </div>
        <div className="avatar-container">
          <div className="avatar-ring" />
          <div className="avatar-placeholder">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="18" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.5)" strokeWidth="1"/>
              <ellipse cx="40" cy="72" rx="28" ry="16" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.4)" strokeWidth="1"/>
            </svg>
            <span className="avatar-emoji">👨‍💻</span>
          </div>
        </div>
        <div className="avatar-tagline">
          <p className="tag-sub">A Designer who</p>
          <h2 className="tag-main">
            Judges a book<br />by its{" "}
            <span className="cover-word">cover<span className="cover-dots">...</span></span>
          </h2>
          <p className="tag-caption">Because if the cover does not impress you what else can?</p>
        </div>
      </div>

      {/* Main text */}
      <div className="hero-content">
        <h1 className="hero-title">
          Yo soy <span className="typed-role">{displayed}<span className="cursor">|</span></span>
        </h1>
        <p className="hero-subtitle">
          Currently working at{" "}
          <a href="#" className="company-link">
            <span className="company-icon">💼</span> Meta
          </a>
        </p>
        <p className="hero-description">
          A self-taught UI/UX designer, functioning in the industry for 3+ years now.
          I make meaningful and delightful digital products that create an equilibrium
          between user needs and business goals.
        </p>
        <div className="hero-actions">
          <a href="#work" className="btn-primary">Ver Proyectos</a>
          <a href="#about" className="btn-ghost">Acerca de mi</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
