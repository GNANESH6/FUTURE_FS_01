import Education from "../models/Education.js";

export const getEducation = async (_, res) =>
  res.json(await Education.find());

export const addEducation = async (req, res) =>
  res.json(await Education.create(req.body));

export const deleteEducation = async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  res.sendStatus(204);

    const education = await Education.findById(id);
  if (!education) {
    return res.status(404).json({ message: "Education not found" });
  }

  await education.deleteOne();
  res.status(200).json({ message: "Education deleted successfully" });
};



