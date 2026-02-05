import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import PageHeader from "../components/PageHeader";

export default function Seo() {
  const [seo, setSeo] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    const fetchSeo = async () => {
      const res = await adminApi.get("/seo");
      if (res.data) {
        setSeo(res.data);
      }
    };
    fetchSeo();
  }, []);

  const save = async () => {
    await adminApi.put("/admin/seo", seo);
    alert("SEO updated");
  };

  return (
    <div className="page">
      <PageHeader title="SEO" subtitle="Search engine settings" />

      <input
        placeholder="Title"
        value={seo.title}
        onChange={e =>
          setSeo(prev => ({ ...prev, title: e.target.value }))
        }
      />

      <textarea
        placeholder="Description"
        value={seo.description}
        onChange={e =>
          setSeo(prev => ({ ...prev, description: e.target.value }))
        }
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
