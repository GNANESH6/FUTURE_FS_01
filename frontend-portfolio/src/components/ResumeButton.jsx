import { useEffect, useState } from "react";
import api from "../services/api";

export default function ResumeButton() {
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    api.get("/resume").then(res => {
      setResumeUrl(res.data?.url);
    });
  }, []);

  if (!resumeUrl) return null;

  return (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noreferrer"
      className="resume-btn"
    >
      My Resume 
    </a>
  );
}
