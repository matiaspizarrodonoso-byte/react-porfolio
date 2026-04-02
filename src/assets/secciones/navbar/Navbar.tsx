import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#" className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 8L16 4L24 8V16L16 28L8 16V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M16 4V28M8 8L24 16M24 8L8 16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4"/>
          </svg>
        </a>
        <ul className="nav-links">
          <li><a href="#home" className="nav-link active">inicio</a></li>
          <li><a href="#about" className="nav-link">Acerca de mi</a></li>
          <li><a href="#work" className="nav-link">Proyectos</a></li>
        </ul>
        <button className="nav-cta">Curriculum</button>
      </div>
    </nav>
  );
};

export default Navbar;
