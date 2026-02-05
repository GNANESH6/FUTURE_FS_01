import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import About from "./pages/About";
import Seo from "./pages/Seo";
import Settings from "./pages/Settings";
import Socials from "./pages/Socials";
import Resume from "./pages/Resume";

import AdminNavbar from "./components/AdminNavbar";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      {/* Show navbar only when logged in */}
      <AdminNavbar />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin protected */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
        <Route path="/experience" element={<ProtectedRoute><Experience /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/seo" element={<ProtectedRoute><Seo /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/socials" element={ <ProtectedRoute><Socials /></ProtectedRoute>} /> 
        <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
