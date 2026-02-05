import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/resume";

// ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    cb(null, "resume" + path.extname(file.originalname));
  }
});

const fileFilter = (_, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only PDF/DOC/DOCX allowed"));
};

export const uploadResume = multer({
  storage,
  fileFilter
});
