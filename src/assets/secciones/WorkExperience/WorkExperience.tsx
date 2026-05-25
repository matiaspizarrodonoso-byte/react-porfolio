import "./WorkExperience.css";


interface Project {
  id: number;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    icon: "⭐",
    title: "Emulador Chip-8",
    description: "Emulador del procesador CHIP-8 construido desde cero, capaz de correr ROMs clásicas como Tetris, Pong y Space Invaders. Implementa el set completo de 35 instrucciones, timers de 60Hz, sonido y sistema de input.",
    tags: ["JavaScript", "Emulación", "Canvas API"],
    color: "#7c3aed",
    link: "/react-porfolio/chip8-emulator/indexchip8.html",
  },
  {
    id: 2,
    icon: "🔮",
    title: "Proximamente un proyecto",
    description: "A comprehensive design system with 200+ components built for scalable products.",
    tags: ["Figma", "TypeScript"],
    color: "#ec4899",
    link: "",
  },
  {
    id: 3,
    icon: "🚀",
    title: "Proximamente un proyecto",
    description: "Real-time data visualization platform built for enterprise-scale analytics.",
    tags: ["React", "D3.js"],
    color: "#3b82f6",
    link: "",
  },
  {
    id: 4,
    icon: "💡",
    title: "Proximamente un proyecto",
    description: "Intelligent content generation tool powered by modern language models.",
    tags: ["Next.js", "OpenAI"],
    color: "#10b981",
    link: "",
  },
];

const WorkExperience = () => {
  return (
    <section id="work" className="work">
      <div className="section-label">
        <span className="label-line" />
        <span className="label-text">Mis Proyectos</span>
      </div>
      <div className="work-grid">
        {projects.map((project) => (
<a 
  key={project.id} 
  href={project.link || "#"} 
  target="_blank" 
  rel="noopener noreferrer"
  style={{ textDecoration: "none" }}
>
  <div 
    className="project-card" 
    style={{ "--card-color": project.color } as React.CSSProperties}
  >
    <div className="card-header">
      <div className="card-icon" style={{ background: `${project.color}22`, border: `1px solid ${project.color}44` }}>
        <span>{project.icon}</span>
              </div>
              <h3 className="card-title">{project.title}</h3>
            </div>
            <p className="card-description">{project.description}</p>
            <div className="card-footer">
              <div className="card-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="card-tag">{tag}</span>
                ))}
              </div>
              <button className="card-btn">Ver Aquí →</button>
            </div>
          </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default WorkExperience;
