import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";
import { socialIcons } from "../utils/socialIcons";
import { FaGlobe } from "react-icons/fa";

export default function Socials() {
  const [socials, setSocials] = useState([]);
  const [form, setForm] = useState({
    platform: "",
    url: ""
  });

  // ✅ Fetch socials ONCE (no warnings)
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await adminApi.get("/socials");
        setSocials(res.data);
      } catch (err) {
        console.error("Fetch socials failed", err);
      }
    };

    fetchSocials();
  }, []);

  const addSocial = async () => {
    if (!form.platform || !form.url) {
      alert("Fill all fields");
      return;
    }

    try {
      await adminApi.post("/admin/socials", form);
      setForm({ platform: "", url: "" });

      const res = await adminApi.get("/socials");
      setSocials(res.data);
    } catch (err) {
      console.error("Add social failed", err);
    }
  };

  const deleteSocial = async (id) => {
    try {
      await adminApi.delete(`/admin/socials/${id}`);

      setSocials(prev =>
        prev.filter(s => s._id !== id)
      );
    } catch (err) {
      console.error("Delete social failed", err);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Socials"
        subtitle="Manage social profile links"
      />

      {/* INPUT FORM */}
      <div className="card admin-social-form">
        <input
          placeholder="Platform (GitHub / LinkedIn / Email / Website)"
          value={form.platform}
          onChange={e =>
            setForm({ ...form, platform: e.target.value })
          }
        />

        <input
          placeholder="Profile URL / Email"
          value={form.url}
          onChange={e =>
            setForm({ ...form, url: e.target.value })
          }
        />

        <button onClick={addSocial}>Add Social</button>
      </div>

      {/* SOCIAL CARDS */}
      <div className="footer-socials admin-socials">
        {socials.map(s => {
          const Icon = socialIcons[s.platform] || FaGlobe;

          return (
            <div
              key={s._id}
              className="social-link admin-social-card"
            >
              <div className="social-left">
                <Icon className="social-icon" />
                <span>{s.platform}</span>
              </div>

              <button
                className="danger small"
                onClick={() => deleteSocial(s._id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
