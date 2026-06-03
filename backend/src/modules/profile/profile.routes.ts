import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import { getMyProfile, uploadProfileAvatar } from "./profile.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();

/**
 * POST /api/profile/upload
 * Form Data: avatar (file)
 * Auth: required
 */
router.post('/upload', authenticateToken, upload.single('avatar'), uploadProfileAvatar)

/**
 * GET /api/profile
 * Auth: required
*/
router.get('/me', authenticateToken, getMyProfile);

export default router;