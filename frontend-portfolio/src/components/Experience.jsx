import { useEffect, useState } from "react";
import api from "../services/api";

export default function Experience() {
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    api.get("/experience").then(res => setExperience(res.data));
  }, []);

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience</h2>

      <div className="grid">
        {experience.map(exp => (
          <div key={exp._id} className="card">
            <h3>{exp.role}</h3>
            <p className="muted">{exp.company}</p>
            <p>{exp.description}</p>
            <span className="muted">{exp.duration}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
