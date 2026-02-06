import { useEffect, useState } from "react";
import { socialIcons } from "../utils/socialIcons";
import { FaGlobe } from "react-icons/fa";

export default function Contact() {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    fetch("https://future-fs-01-yky5.onrender.com/api/socials")
      .then((res) => res.json())
      .then((data) => setSocials(data))
      .catch((err) => console.error("Social fetch error", err));
  }, []);

  return (
    <section id="contact">
      <h2 className="section-title">Contact Details</h2>

      <div className="footer-socials">
        {socials.map((s) => {
          const Icon = socialIcons[s.platform] || FaGlobe;

          // ✅ Force Gmail for Email platform
          const href =
            s.platform === "Email"
              ? `https://mail.google.com/mail/?view=cm&fs=1&to=${s.url}`
              : s.url;

          return (
            <a
              key={s._id}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <Icon className="social-icon" />
              <span>{s.platform}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
