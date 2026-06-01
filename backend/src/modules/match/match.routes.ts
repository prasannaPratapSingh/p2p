import { Router } from "express";
import { getDashboardMatches } from "./match.controller.js";
import authenticateToken from "../auth/auth.middleware.js";

const router = Router();

router.get('/dashboard', authenticateToken, getDashboardMatches);

export default router;
