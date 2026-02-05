import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { login, register } from "../controllers/auth.controller.js";
import { addSkill, updateSkill, deleteSkill } from "../controllers/skill.controller.js";
import { addProject,updateProject,deleteProject } from "../controllers/project.controller.js";
import { saveAbout} from "../controllers/about.controller.js";
import { addExperience,  updateExperience, deleteExperience } from "../controllers/experience.controller.js";
import { addEducation, deleteEducation } from "../controllers/education.controller.js";
import { addSocial, updateSocial, deleteSocial } from "../controllers/social.controller.js";
import { updateSeo } from "../controllers/seo.controller.js";
import { saveSettings } from "../controllers/settings.controller.js";

import { uploadResume } from "../config/multer.js";
import { uploadResumeFile, deleteResume } from "../controllers/resume.controller.js";


const router = Router();

//router.post("/register", register); // remove later
router.post("/login", login);

// SKILLS
router.post("/skills", protect, addSkill);
router.put("/skills/:id", protect, updateSkill);
router.delete("/skills/:id", protect, deleteSkill);

// ABOUT (singleton)
router.post("/about", protect, saveAbout);


// PROJECTS
router.post("/projects", protect, addProject);
router.put("/projects/:id", protect, updateProject);
router.delete("/projects/:id", protect, deleteProject);

// EXPERIENCE
router.post("/experience", protect, addExperience);
router.put("/experience/:id", protect, updateExperience);
router.delete("/experience/:id", protect, deleteExperience);

// EDUCATION
router.post("/education", protect, addEducation);
router.delete("/education/:id", protect, deleteEducation);

// SOCIALS
router.post("/socials", protect, addSocial);
router.put("/socials/:id", protect, updateSocial);
router.delete("/socials/:id", protect, deleteSocial);

// SEO (singleton)
router.put("/seo", protect, updateSeo);

// SETTINGS (singleton)
router.put("/settings", protect, saveSettings);

// Resume
router.post("/resume",  protect, uploadResume.single("resume"), uploadResumeFile);
router.delete("/resume", protect, deleteResume);

export default router;

