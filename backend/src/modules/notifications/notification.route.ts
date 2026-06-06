import { Router } from "express";
import { getUserNotification, markAsRead } from "./notification.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();

router.get('/', authenticateToken, getUserNotification);
router.post('/mark-read-all', authenticateToken, markAsRead);

export default router;
