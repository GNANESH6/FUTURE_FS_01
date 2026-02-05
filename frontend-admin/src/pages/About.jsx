import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function About() {
  const [content, setContent] = useState("");

  useEffect(() => {
    adminApi.get("/about").then(res => {
      setContent(res.data?.content || "");
    });
  }, []);

  const save = async () => {
    await adminApi.post("/admin/about", { content });
    alert("About section saved");
  };

  return (
    <div className="page">
      <PageHeader title="About" subtitle="Edit about section" />

      <textarea
        rows="6"
        placeholder="Write about yourself..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
