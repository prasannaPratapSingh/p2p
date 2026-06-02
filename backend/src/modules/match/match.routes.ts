import { Router } from "express";
import { getDashboardMatches } from "./match.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();

/**
 * GET /api/match/dashboard
 * Params: none
 * Auth: required
 */
router.get('/dashboard', authenticateToken, getDashboardMatches);

export default router;
