import "./About.css";

const skills = ["React", "TypeScript", "Node.js", "SQL", "UI/UX", "Python", "Django", "Javascript"];

const About = () => {
  return (
    <section id="about" className="about">
      <div className="section-label">
        <span className="label-line" />
        <span className="label-text">Acerca de mi</span>
      </div>

      <div className="about-grid">
        <div className="about-text">
          <h2 className="section-title">
            EXPERIENCIA LABORAL<br />
            <span className="accent-text">Contraloría General de la República </span> 
          </h2>
          <p className="about-body">
            Participé en la migración de portales institucionales a Liferay 7.4, realizando soporte 
            y seguimiento de incidencias técnicas, además del desarrollo de componentes personalizados 
            con Java, Bootstrap y CSS.
          </p>
          <p className="about-body">
            Me encargué del registro y archivo de documentación técnica para asegurar la trazabilidad 
            del proyecto, ejecuté pruebas funcionales en entornos multiplataforma y elaboré manuales 
            y reportes técnicos para jefatura.
          </p>
        </div>

        <div className="about-stats">
          <div className="stat-card">
            <span className="stat-number">3+</span>
            <span className="stat-label"> Meses experiencia</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">4+</span>
            <span className="stat-label">Proyectos</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">∞</span>
            <span className="stat-label">CAFÉ</span>
          </div>
        </div>
      </div>

      <div className="skills-section">
        <p className="skills-label">Herramientas y tecnologías</p>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill} className="skill-pill">{skill}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
