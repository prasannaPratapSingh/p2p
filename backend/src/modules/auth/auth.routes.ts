import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { login, logout, refreshToken, register } from "./auth.controller.js";
import { strictAuthLimiter } from "../../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', strictAuthLimiter, validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);


export default router;

