import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  const [settings, setSettings] = useState({
    email: "",
    phone: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await adminApi.get("/settings");
      if (res.data) {
        setSettings(res.data);
      }
    };
    fetchSettings();
  }, []);

  const save = async () => {
    await adminApi.put("/admin/settings", settings);
    alert("Settings saved");
  };

  return (
    <div className="page">
      <PageHeader title="Settings" subtitle="Contact & general settings" />

      <input
        placeholder="Email"
        value={settings.email}
        onChange={e =>
          setSettings(prev => ({ ...prev, email: e.target.value }))
        }
      />

      <input
        placeholder="Phone"
        value={settings.phone}
        onChange={e =>
          setSettings(prev => ({ ...prev, phone: e.target.value }))
        }
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
