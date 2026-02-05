import { useEffect } from "react";
import api from "../services/api";

export default function Seo() {
  useEffect(() => {
    const applySeo = async () => {
      const res = await api.get("/seo");
      const { title, description } = res.data || {};

      if (title) {
        document.title = title;
      }

      let metaDescription = document.querySelector(
        "meta[name='description']"
      );

      // 🔥 Create meta tag if it doesn't exist
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }

      if (description) {
        metaDescription.setAttribute("content", description);
      }
    };

    applySeo();
  }, []);

  return null;
}
