import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Socials from "./components/Socials";
import Footer from "./components/Footer";
import Seo from "./seo/Seo";

export default function App() {
  return (
    <>
      <Seo />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Socials />
      <Footer />
    </>
  );
}
