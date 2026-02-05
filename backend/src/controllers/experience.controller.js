import Experience from "../models/Experience.js";

// GET (public)
export const getExperience = async (req, res) => {
  res.json(await Experience.find());
};

// ADD
export const addExperience = async (req, res) => {
  res.status(201).json(await Experience.create(req.body));
};

// UPDATE
export const updateExperience = async (req, res) => {
  const exp = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!exp) {
    return res.status(404).json({ message: "Experience not found" });
  }

  res.json(exp);
};

// DELETE
export const deleteExperience = async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: "Experience deleted" });
};
