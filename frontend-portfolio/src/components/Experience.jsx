import { useEffect, useState } from "react";
import api from "../services/api";

export default function Experience() {
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await api.get("/experience");
      setExperience(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience</h2>

      <div className="grid">
        {experience.map((exp) => (
          <div key={exp._id} className="card">
            <h3>{exp.role}</h3>
            <p className="muted">{exp.company}</p>

            {exp.description && <p>{exp.description}</p>}

            <span className="muted">{exp.period}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
