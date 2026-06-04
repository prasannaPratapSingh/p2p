import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { getMe, login, logout, refreshToken, register } from "./auth.controller.js";
import { strictAuthLimiter } from "../../middlewares/rateLimiter.middleware.js";
import authenticateToken from "./auth.middleware.js";

const router = Router();

/**
 * POST /api/auth/register
 * Body params: { email, password, name }
 */
router.post('/register', validateRequest(registerSchema), register);

/**
 * POST /api/auth/login
 * Body params: { email, password }
 */
router.post('/login', strictAuthLimiter, validateRequest(loginSchema), login);

/**
 * POST /api/auth/refresh
 * Cookies: refreshToken
 */
router.post('/refresh', refreshToken);

/**
 * POST /api/auth/logout
 * Cookies: refreshToken
 */
router.post('/logout', logout);

router.get('/get-me', authenticateToken, getMe);

export default router;

