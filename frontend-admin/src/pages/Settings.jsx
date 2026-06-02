import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    leetcodeUsername: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await adminApi.get("/settings");
      if (res.data) {
        setSettings(prev => ({
          ...prev,
          ...res.data
        }));
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
      <PageHeader title="Settings" subtitle="Contact, general & LeetCode settings" />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Admin Email</label>
      <input
        placeholder="Email"
        value={settings.email || ""}
        onChange={e =>
          setSettings(prev => ({ ...prev, email: e.target.value }))
        }
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Admin Phone</label>
      <input
        placeholder="Phone"
        value={settings.phone || ""}
        onChange={e =>
          setSettings(prev => ({ ...prev, phone: e.target.value }))
        }
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>LeetCode Username</label>
      <input
        placeholder="LeetCode Username (e.g. kamyu)"
        value={settings.leetcodeUsername || ""}
        onChange={e =>
          setSettings(prev => ({ ...prev, leetcodeUsername: e.target.value }))
        }
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>GitHub Username</label>
      <input
        placeholder="GitHub Username"
        value={settings.githubUsername || ""}
        onChange={e =>
          setSettings(prev => ({ ...prev, githubUsername: e.target.value }))
        }
      />

      <button onClick={save}>Save Settings</button>
    </div>
  );
}
