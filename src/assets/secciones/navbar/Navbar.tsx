import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);
  
const handleNavcv = () => {
  const pdfURL = `${import.meta.env.BASE_URL}curriculum/C_Matias_Pizarro_WebDev.pdf`;
  window.open(pdfURL, "_blank");
};

  return (
    <nav className={`navbar navbar-expand-md ${scrolled ? "scrolled" : ""}`}>
      <div className="container-xl navbar-inner">

        {/* Logo */}
        <a href="#" className="logo navbar-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 8L16 4L24 8V16L16 28L8 16V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M16 4V28M8 8L24 16M24 8L8 16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4"/>
          </svg>
        </a>

        {/* Botón hamburguesa — solo visible en mobile */}
        <button
          className={`hamburger-btn navbar-toggler ${menuOpen ? "open" : ""}`}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
        </button>

        {/* Menú colapsable */}
        <div className={`navbar-collapse collapse ${menuOpen ? "show" : ""}`}>
          <ul className="nav-links navbar-nav mx-auto">
            <li className="nav-item">
              <a href="#home" className="nav-link active" onClick={handleNavClick}>Inicio</a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={handleNavClick}>Acerca de mí</a>
            </li>
            <li className="nav-item">
              <a href="#work" className="nav-link" onClick={handleNavClick}>Proyectos</a>
            </li>
          </ul>
          <button className="nav-cta" onClick={handleNavcv}>Curriculum</button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;