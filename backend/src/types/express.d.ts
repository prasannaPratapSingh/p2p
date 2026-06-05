import type { IUser } from "../models/user/user.types.js";

declare global {
    namespace Express {
        // Covers both authenticated DB user (getMe) and Passport Google profile (googleCallback)
        interface User {
            id?: string;
            emails?: Array<{ value: string }>;
            displayName?: string;
        }
    }
}