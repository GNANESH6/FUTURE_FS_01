import { useEffect, useState } from "react";
import api from "../services/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get("/skills").then(res => setSkills(res.data));
  }, []);

  return (
    <section id="skills">
      <h2 className="section-title">Skills</h2>
      <div className="grid">
        {skills.map(s => (
          <div key={s._id} className="card">{s.name}</div>
        ))}
      </div>
    </section>
  );
}
