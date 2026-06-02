import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import { uploadProfileAvatar } from "./profile.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();


router.post('/upload', authenticateToken, upload.single('avatar'), uploadProfileAvatar)


export default router;