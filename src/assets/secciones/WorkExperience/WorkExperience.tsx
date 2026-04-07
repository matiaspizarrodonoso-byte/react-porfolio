import "./WorkExperience.css";

interface Project {
  id: number;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    icon: "⭐",
    title: "Ejemplo de un proyecto",
    description: "Take your client onboard seamlessly by our amazing tool of digital onboard process.",
    tags: ["React Native", "UX Design"],
    color: "#7c3aed",
  },
  {
    id: 2,
    icon: "🔮",
    title: "Proximamente un proyecto",
    description: "A comprehensive design system with 200+ components built for scalable products.",
    tags: ["Figma", "TypeScript"],
    color: "#ec4899",
  },
  {
    id: 3,
    icon: "🚀",
    title: "Proximamente un proyecto",
    description: "Real-time data visualization platform built for enterprise-scale analytics.",
    tags: ["React", "D3.js"],
    color: "#3b82f6",
  },
  {
    id: 4,
    icon: "💡",
    title: "Proximamente un proyecto",
    description: "Intelligent content generation tool powered by modern language models.",
    tags: ["Next.js", "OpenAI"],
    color: "#10b981",
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
          <div key={project.id} className="project-card" style={{ "--card-color": project.color } as React.CSSProperties}>
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
              <button className="card-btn">Leer más →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkExperience;
