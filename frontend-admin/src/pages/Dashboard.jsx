import PageHeader from "../components/PageHeader";
import adminPhoto from "../assets/images/admin.webp";

export default function Dashboard() {
  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle="Manage your portfolio content"
      />

      <div className="dashboard-card">
        <img src={adminPhoto} alt="Admin" className="admin-photo" />

        <div>
          <h3>Welcome, GNANESHWAR REDDY SANGATI 👋</h3>
          {/* <p>
            From here you can manage skills, projects, resume, education,
            experience, SEO, and more.
          </p> */}
        </div>
      </div>
    </div>
  );
}
