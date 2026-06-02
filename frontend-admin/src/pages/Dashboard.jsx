import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import adminPhoto from "../assets/images/admin.webp";
import LeetCodeStreakPanel from "../components/LeetCodeStreakPanel";
import GithubStreakPanel from "../components/GithubStreakPanel";
import adminApi from "../services/adminApi";

export default function Dashboard() {
  const [leetcodeUser, setLeetcodeUser] = useState("");
  const [githubUser, setGithubUser] = useState("");

  useEffect(() => {
    adminApi.get("/settings").then(res => {
      if (res.data) {
        setLeetcodeUser(res.data.leetcodeUsername || "");
        setGithubUser(res.data.githubUsername || "");
      }
    });
  }, []);

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle="Manage your portfolio content"
      />

      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <img src={adminPhoto} alt="Admin" className="admin-photo" />

        <div>
          <h3>Welcome, GNANESHWAR REDDY SANGATI 👋</h3>
        </div>
      </div>

      <LeetCodeStreakPanel username={leetcodeUser} />
      <div style={{ marginTop: '30px' }}>
        <GithubStreakPanel username={githubUser} />
      </div>
    </div>
  );
}
