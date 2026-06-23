import { useEffect, useState } from "react";
import { socialIcons } from "../utils/socialIcons";
import { FaGlobe } from "react-icons/fa";
import LeetCodeStreakPanel from "./LeetCodeStreakPanel";
import GitHubStreakPanel from "./GitHubStreakPanel";

export default function Contact() {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    fetch("https://future-fs-01-yky5.onrender.com/api/socials")
      .then((res) => res.json())
      .then((data) => setSocials(data))
      .catch((err) => console.error("Social fetch error", err));
  }, []);

  return (
    <section>
      <div id="leetcode">
        <h2 className="section-title">LeetCode Metrics</h2>
        <LeetCodeStreakPanel />
      </div>

      <div id="github-panel" style={{ marginTop: "48px" }}>
        {/* <h2 className="section-title">GitHub Metrics</h2> */}
        <GitHubStreakPanel />
      </div>

      <div id="contact" style={{ marginTop: "55px" }}>
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
      </div>
    </section>
  );
}
