import Seo from "../models/Seo.js";

// GET (public)
export const getSeo = async (req, res) => {
  res.json(await Seo.findOne());
};

// CREATE or UPDATE (admin)
export const updateSeo = async (req, res) => {
  const seo = await Seo.findOneAndUpdate(
    {},
    req.body,
    { new: true, upsert: true }
  );

  res.json(seo);
};

