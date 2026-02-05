import adminImg from "../assets/images/admin.webp";
import ResumeButton from "./ResumeButton";

export default function Hero() {
  return (
    <section className="hero">
      <div>
        <h2>Hello, I’m</h2>
        <h2>GNANESHWAR REDDY SANGATI</h2>
        <p>Full-Stack Developer</p>
      </div>

      <img src={adminImg} alt="Admin" className="hero-img float" />

      <div>
        <ResumeButton />
      </div>
    </section>
  );
}
