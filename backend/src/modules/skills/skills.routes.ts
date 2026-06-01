import { Router } from "express";
import { getMySkills, skillsUpdate } from "./skills.controller.js";
import authenticateToken from "../auth/auth.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { skillSchema } from "./skill.validation.js";

const router = Router();


router.put('/update', authenticateToken, validateRequest(skillSchema), skillsUpdate);
router.get('/me', authenticateToken, getMySkills)

export default router;