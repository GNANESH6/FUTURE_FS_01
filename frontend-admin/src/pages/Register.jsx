import { useState } from "react";
import adminApi from "../services/adminApi";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const register = async () => {
    await adminApi.post("/admin/register", form);
    alert("Admin created");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Admin</h2>

        <input placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <input type="password" placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />

        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}
