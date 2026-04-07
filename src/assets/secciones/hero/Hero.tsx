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
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 3000);
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
          <p className="tag-sub">Ingeniero de software</p>
          <h2 className="tag-main">
            Un libro no se juzga<br />por su{" "}
            <span className="cover-word">portada<span className="cover-dots">...</span></span>
          </h2>
          <p className="tag-caption">¿Porque si la portada no te impresiona, ¿qué otra cosa lo hará?</p>
        </div>
      </div>

      {/* Main text */}
      <div className="hero-title-wrapper">
  <h1 className="hero-title">
    Yo soy <span className="typed-role">{displayed}<span className="cursor">|</span></span>
  </h1>
</div>
  <div className="hero-content"></div>
      <div className="hero-content">
        <p className="hero-subtitle">
          En búsqueda de oportunidades{" "}
          <a href="#" className="company-link">
            <span className="company-icon">👀</span> 
          </a>
        </p>
        <p className="hero-description">
            Ingeniero en Informática especializado en cloud computing y datos, con experiencia práctica en GCP y AWS.
            He diseñado pipelines ETL con BigQuery y Dataflow, 
            automatizando flujos de datos a gran escala usando Python y SQL.
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
