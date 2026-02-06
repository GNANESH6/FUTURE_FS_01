import { useEffect, useState } from "react";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch("https://future-fs-01-yky5.onrender.com/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  if (!settings) return null;

  return (
    <footer className="footer">
      <g>Email: {settings.email  || "—"}</g>|
      <g>Phone: {settings.phone || "—"}</g>|
      <g>© 2026 Gnanesh Reddy All rights reserved</g>
    </footer>
  );
}
