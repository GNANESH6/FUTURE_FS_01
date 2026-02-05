import { useEffect, useState } from "react";
import api from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await api.get("/projects");
      setProjects(res.data);
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects">
      <h2 className="section-title">Projects</h2>

      <div className="grid">
        {projects.map((p) => (
          <div key={p._id} className="card project-card">
            <h3>{p.title}</h3>
            <p>{p.description}</p>

            <div className="project-actions">
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-btn"
                >
                 GitHub
                </a>
              )}

              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-btn secondary"
                >
                 Visit site
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
