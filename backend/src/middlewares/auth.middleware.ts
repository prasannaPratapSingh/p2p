import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user/user.model.js";
import envConfig from "../config/envConfig.js";



interface CustomJwtPayload extends JwtPayload {
    id: string;
}

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request! Access token is missing.");
    }

    try {
        const decoded = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as CustomJwtPayload;

        if (!decoded || typeof decoded === "string" || !decoded.id) {
            throw new ApiError(401, "Invalid access token structure");
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid access token! User does not exist.");
        }

        req.user = user;

        next();

    } catch (error) {
        throw new ApiError(401, "Access token is invalid or expired");
    }
});