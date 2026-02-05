// frontend-admin/src/pages/Projects.jsx
import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
  });

  // ✅ Fetch projects ONCE on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await adminApi.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };

    fetchProjects();
  }, []);

  // ✅ Add project
  const addProject = async () => {
    if (!form.title || !form.description) {
      alert("Title and description required");
      return;
    }

    try {
      await adminApi.post("/admin/projects", form);
      setForm({ title: "", description: "", githubUrl: "", liveUrl: "" });

      // re-fetch
      const res = await adminApi.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to add project", err);
    }
  };

  // ✅ Delete project
  const deleteProject = async (id) => {
    try {
      await adminApi.delete(`/admin/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <div className="page">
      <PageHeader title="Projects" subtitle="Manage your projects" />

      {/* ADD PROJECT FORM */}
      <div className="card">
        <input
          placeholder="Project title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Project description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="GitHub Repository URL"
          value={form.githubUrl}
          onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
        />

        <input
          placeholder="Live / Deployed URL"
          value={form.liveUrl}
          onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
        />

        <button onClick={addProject}>Add Project</button>
      </div>

      {/* PROJECT LIST */}
      <div className="grid">
        {projects.map((p) => (
          <div key={p._id} className="card">
            <h4>{p.title}</h4>
            <p>{p.description}</p>

            <div style={{ display: "flex", gap: "12px" }}>
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noreferrer">
                  <button>
                    {" "}
                    <h4>GitHub</h4>
                  </button>
                </a>
              )}

              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer">
                  <button>
                    {" "}
                    <h4>Visit site</h4>
                  </button>
                </a>
              )}
            </div>

            <button className="danger" onClick={() => deleteProject(p._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
