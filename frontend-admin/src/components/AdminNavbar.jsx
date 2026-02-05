import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminNavbar() {
  const { logout } = useAuth();

  return (
    <nav className="admin-nav">
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
            
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
