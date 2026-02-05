import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function Education() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    degree: "",
    institute: "",
    year: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await adminApi.get("/education");
      setItems(res.data);
    };
    fetchData();
  }, []);

  const addEducation = async () => {
    await adminApi.post("/admin/education", form);
    setForm({ degree: "", institute: "", year: "" });

    const res = await adminApi.get("/education");
    setItems(res.data);
  };

  const deleteEducation = async (id) => {
    await adminApi.delete(`/admin/education/${id}`);

    const res = await adminApi.get("/education");
    setItems(res.data);
  };

  return (
    <div className="page">
      <PageHeader title="Education" />

      <input
        placeholder="Degree"
        value={form.degree}
        onChange={e => setForm({ ...form, degree: e.target.value })}
      />
      <input
        placeholder="Institute"
        value={form.institute}
        onChange={e => setForm({ ...form, institute: e.target.value })}
      />
      <input
        placeholder="Year"
        value={form.year}
        onChange={e => setForm({ ...form, year: e.target.value })}
      />

      <button onClick={addEducation}>Add</button>

      {items.map(e => (
        <div className="card" key={e._id}>
          <strong>{e.degree}</strong>
          <p>{e.institute} ({e.year})</p>
          <button onClick={() => deleteEducation(e._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
