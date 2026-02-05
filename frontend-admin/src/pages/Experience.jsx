import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function Experience() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    role: "",
    company: "",
    period: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await adminApi.get("/experience");
      setItems(res.data);
    };
    fetchData();
  }, []);

  const addExperience = async () => {
    await adminApi.post("/admin/experience", form);
    setForm({ role: "", company: "", period: "" });

    const res = await adminApi.get("/experience");
    setItems(res.data);
  };

  const deleteExperience = async (id) => {
    await adminApi.delete(`/admin/experience/${id}`);

    const res = await adminApi.get("/experience");
    setItems(res.data);
  };

  return (
    <div className="page">
      <PageHeader title="Experience" />

      <input placeholder="Role"
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
      />
      <input placeholder="Company"
        value={form.company}
        onChange={e => setForm({ ...form, company: e.target.value })}
      />
      <input placeholder="Period"
        value={form.period}
        onChange={e => setForm({ ...form, period: e.target.value })}
      />

      <button onClick={addExperience}>Add</button>

      {items.map(x => (
        <div className="card" key={x._id}>
          <strong>{x.role}</strong>
          <p>{x.company} — {x.period}</p>
          <button onClick={() => deleteExperience(x._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
