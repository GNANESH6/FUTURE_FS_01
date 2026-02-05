import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      const res = await adminApi.get("/skills");
      setSkills(res.data);
    };
    fetchSkills();
  }, []);

  const addSkill = async () => {
    if (!name) return;
    await adminApi.post("/admin/skills", { name });
    setName("");

    const res = await adminApi.get("/skills");
    setSkills(res.data);
  };

  const deleteSkill = async (id) => {
    await adminApi.delete(`/admin/skills/${id}`);

    const res = await adminApi.get("/skills");
    setSkills(res.data);
  };

  return (
    <div className="page">
      <PageHeader title="Skills" />

      <input
        placeholder="New skill"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addSkill}>Add</button>

      {skills.map(s => (
        <div key={s._id} className="card">
          {s.name}
          <button onClick={() => deleteSkill(s._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
