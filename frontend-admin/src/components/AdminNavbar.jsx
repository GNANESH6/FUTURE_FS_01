import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";

export default function AdminNavbar() {
  const { logout } = useAuth();
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
    <nav className="admin-nav-wrapper">
      <div className="admin-nav-inner">
        <div className="admin-brand">GNANESH REDDY</div>

        {/* Hamburger toggle button */}
        <button 
          className={`admin-nav-toggle ${isOpen ? "open" : ""}`} 
          onClick={toggleMenu}
          aria-label="Toggle admin navigation menu"
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        {/* Desktop links */}
        <div className="admin-nav-links desktop-menu">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/education">Education</NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/seo">SEO</NavLink>
          <NavLink to="/settings">E-Mail</NavLink>
          <NavLink to="/socials">Socials</NavLink>
          <NavLink to="/resume">Resume</NavLink>
          <button onClick={logout} className="logout-btn small">Logout</button>
        </div>
      </div> 

      {/* Mobile menu overlay */}
      <div className={`admin-mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="admin-mobile-links">
          <NavLink to="/" onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/skills" onClick={closeMenu}>Skills</NavLink>
          <NavLink to="/projects" onClick={closeMenu}>Projects</NavLink>
          <NavLink to="/education" onClick={closeMenu}>Education</NavLink>
          <NavLink to="/experience" onClick={closeMenu}>Experience</NavLink>
          <NavLink to="/seo" onClick={closeMenu}>SEO</NavLink>
          <NavLink to="/settings" onClick={closeMenu}>E-Mail</NavLink>
          <NavLink to="/socials" onClick={closeMenu}>Socials</NavLink>
          <NavLink to="/resume" onClick={closeMenu}>Resume</NavLink>
          <button onClick={() => { closeMenu(); logout(); }} className="logout-btn small">Logout</button>
        </div>
      </div>
    </nav>
  );
}
