import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { registerSchema } from "./auth.validation.js";
import register from "./auth.controller.js";

const router = Router();

router.post('/register', validateRequest(registerSchema), register);

export default router;

