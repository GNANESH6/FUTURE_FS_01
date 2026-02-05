import { useEffect, useState } from "react";

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/about")
      .then(res => res.json())
      .then(data => setAbout(data));
  }, []);

  if (!about?.content) return null;

  return (
    <section id="about">
      <h2 className="section-title">About Me</h2>
      <p className="muted">{about.content}</p>
    </section>
  );
}
