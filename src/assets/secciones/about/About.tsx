import "./About.css";

const skills = ["React", "TypeScript", "Node.js", "Figma", "UI/UX", "Next.js", "Tailwind", "PostgreSQL"];

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
            Crafting digital<br />
            <span className="accent-text">experiences</span> that matter
          </h2>
          <p className="about-body">
            I bridge the gap between design and engineering, turning complex problems into elegant,
            intuitive solutions. With a passion for pixel-perfect UI and clean code, I build
            products people love to use.
          </p>
          <p className="about-body">
            When I'm not shipping features, I'm exploring new design systems, contributing to
            open source, and pushing the boundaries of what's possible on the web.
          </p>
        </div>

        <div className="about-stats">
          <div className="stat-card">
            <span className="stat-number">3+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">20+</span>
            <span className="stat-label">Projects Shipped</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">∞</span>
            <span className="stat-label">Coffee Consumed</span>
          </div>
        </div>
      </div>

      <div className="skills-section">
        <p className="skills-label">Tech Stack</p>
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
