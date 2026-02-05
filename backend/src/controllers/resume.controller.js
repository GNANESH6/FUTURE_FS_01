import Resume from "../models/Resume.js";
import fs from "fs";

const RESUME_PATH = "/uploads/resume/resume";

// GET (public)
export const getResume = async (req, res) => {
  const resume = await Resume.findOne();
  res.json(resume);
};

// UPLOAD / REPLACE (admin)
export const uploadResumeFile = async (req, res) => {
  const ext = req.file.originalname.split(".").pop();
  const url = `${req.protocol}://${req.get("host")}/uploads/resume/resume.${ext}`;

  const resume = await Resume.findOneAndUpdate(
    {},
    { filename: req.file.filename, url },
    { upsert: true, new: true }
  );

  res.json(resume);
};

// DELETE (admin)
export const deleteResume = async (req, res) => {
  const resume = await Resume.findOne();
  if (!resume) return res.sendStatus(404);

  fs.unlinkSync(`uploads/resume/${resume.filename}`);
  await resume.deleteOne();

  res.json({ message: "Resume deleted" });
};
