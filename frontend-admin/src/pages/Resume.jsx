import { useState } from "react";
import adminApi from "../services/adminApi";

export default function Resume() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const form = new FormData();
    form.append("resume", file);

    await adminApi.post("/admin/resume", form);
    alert("Resume uploaded");
  };

  const remove = async () => {
    await adminApi.delete("/admin/resume");
    alert("Resume deleted");
  };

  return (
    <div className="resume">
      <h2>Resume</h2>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={upload}>Upload</button>
      <button onClick={remove}>Delete</button>
    </div>
  );
}
