import Social from "../models/Social.js";

// GET (public)
export const getSocials = async (req, res) => {
  res.json(await Social.find());
};

// ADD
export const addSocial = async (req, res) => {
  res.status(201).json(await Social.create(req.body));
};

// UPDATE
export const updateSocial = async (req, res) => {
  const social = await Social.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!social) {
    return res.status(404).json({ message: "Social link not found" });
  }

  res.json(social);
};

// DELETE
export const deleteSocial = async (req, res) => {
  await Social.findByIdAndDelete(req.params.id);
  res.json({ message: "Social deleted" });
};
