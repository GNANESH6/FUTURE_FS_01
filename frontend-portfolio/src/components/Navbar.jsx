import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <h2>GNANESH REDDY</h2>

        {/* Hamburger toggle button */}
        <button 
          className={`nav-toggle ${isOpen ? "open" : ""}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        {/* Desktop links */}
        <div className="nav-links desktop-menu">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>       
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#leetcode">LeetCode</a>
          <a href="#github-panel">GitHub</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-links">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>       
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#education" onClick={closeMenu}>Education</a>
          <a href="#leetcode" onClick={closeMenu}>LeetCode</a>
          <a href="#github-panel" onClick={closeMenu}>GitHub</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>
      </div>
    </nav>
  );
}
