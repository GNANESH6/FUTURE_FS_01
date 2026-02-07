import { useEffect, useState } from "react";
import api from "../services/api";

export default function Education() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    api.get("/education").then(res => setEducation(res.data));
  }, []);

  return (
    <section id="education" className="section">
      <h2 className="section-title">Education</h2>

      <div className="grid">
        {education.map(e => (
          <div key={e._id} className="card">
            <h3>{e.degree}</h3>
            <p className="muted">{e.institute}</p>
            <span className="muted">{e.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
