import { Router } from "express";
import { getSkills } from "../controllers/skill.controller.js";
import { getAbout } from "../controllers/about.controller.js";
import { getProjects } from "../controllers/project.controller.js";
import { getExperience } from "../controllers/experience.controller.js";
import { getEducation } from "../controllers/education.controller.js";
import { getSocials } from "../controllers/social.controller.js";
import { getSeo } from "../controllers/seo.controller.js";
import { getSettings } from "../controllers/settings.controller.js";
import { getResume } from "../controllers/resume.controller.js";

const router = Router();

router.get("/skills", getSkills);
router.get("/about", getAbout);
router.get("/projects", getProjects);
router.get("/experience", getExperience);
router.get("/education", getEducation);
router.get("/socials", getSocials);
router.get("/seo", getSeo);
router.get("/settings", getSettings);
router.get("/resume", getResume);


export default router;
