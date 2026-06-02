import { Router } from "express";
import { completeConnectionSwap, respondToConnectionRequest, sendConnectionRequest , getMyConnections } from "./connecions.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();

router.post('/request', authenticateToken, sendConnectionRequest);
router.post('/respond', authenticateToken, respondToConnectionRequest);
router.post('/complete', authenticateToken, completeConnectionSwap);
router.get('/me', authenticateToken, getMyConnections);

export default router;