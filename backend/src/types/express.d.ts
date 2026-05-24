import { UserType } from "../models/user.model"; // Aapke user model ka type/interface

declare global {
    namespace Express {
        interface Request {
            user?: UserType; // Taaki req.user pure project mein available ho jaye
        }
    }
}