import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { getMe, login, logout, refreshToken, register , googleCallback} from "./auth.controller.js";
import { strictAuthLimiter } from "../../middlewares/rateLimiter.middleware.js";
import authenticateToken from "./auth.middleware.js";
import config from "../../config/envConfig.js";
import passport from "passport";
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


router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
)

router.get("/google/callback",
    passport.authenticate("google",
        {
            session: false,
            failureRedirect: `${config.CLIENT_URL}/login`
        }),

    googleCallback,
)







export default router;

