import { Router } from "express";
import { completeConnectionSwap, respondToConnectionRequest, sendConnectionRequest, getMyConnections, getAllConnections, cancelConnection } from "./connecions.controller.js";
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

router.post('/accept', authenticateToken, (req, res, next) => {
    req.body.action = 'accepted';
    void respondToConnectionRequest(req, res, next);
});

router.post('/reject', authenticateToken, (req, res, next) => {
    req.body.action = 'rejected';
    void respondToConnectionRequest(req, res, next);
});

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

/**
 * GET /api/connection/all
 * Params: none
 * Auth: required
 */
router.get('/all', authenticateToken, getAllConnections);

router.post('/cancel', authenticateToken, cancelConnection);

export default router;