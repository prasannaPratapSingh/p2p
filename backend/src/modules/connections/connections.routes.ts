import { Router } from "express";
import { completeConnectionSwap, respondToConnectionRequest, sendConnectionRequest , getMyConnections } from "./connecions.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();

/**
 * POST /api/connection/request
 * Body params: { receiverId, proposedTime }
 * Auth: required
 */
router.post('/request', authenticateToken, sendConnectionRequest);

/**
 * POST /api/connection/respond
 * Body params: { connectionId, action }
 * Auth: required
 */
router.post('/respond', authenticateToken, respondToConnectionRequest);

/**
 * POST /api/connection/complete
 * Body params: { connectionId }
 * Auth: required
 */
router.post('/complete', authenticateToken, completeConnectionSwap);

/**
 * GET /api/connection/me
 * Params: none
 * Auth: required
 */
router.get('/me', authenticateToken, getMyConnections);

export default router;