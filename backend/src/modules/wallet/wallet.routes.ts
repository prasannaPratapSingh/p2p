import { Router } from "express";
import { getMyWallet } from "./wallet.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();

/**
 * GET /api/wallet/me
 * Params: none
 * Auth: required
 */
router.get('/me', authenticateToken, getMyWallet);

export default router;