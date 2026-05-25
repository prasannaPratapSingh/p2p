import type { Response, Request, CookieOptions } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { loginBody, registerBody } from "./auth.type.js";
import ApiError from "../../utils/ApiError.js";
import bcrypt from "bcryptjs";
import envConfig from "../../config/envConfig.js";
import User from "../user/user.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { generateAccessToken, generateRefreshToken } from "./auth.utils.js";
import { redisClient } from "../../infrastructure/redis/redis.js";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from "jsonwebtoken";

const salt = envConfig.SALT_VALUE;

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

// Cookie options ko ek jagah rakh liya re-use karne ke liye
const cookieOptions = {
    httpOnly: true,
    secure: envConfig.NODE_ENV === 'production',
    sameSite: 'strict' as const
};



export const register = asyncHandler(async (
    req: Request<{}, {}, registerBody>,
    res: Response) => {
    const { email, password, name } = req.body;



    if (!email || !password || !name) {
        throw new ApiError(400, "Fill all the fields");
    }

    const userAlreadyExists = await User.findOne({
        $or: [
            { name },
            { email }
        ]
    })


    if (userAlreadyExists) {
        throw new ApiError(403, "User with the email or name already exists!")
    };


    const hashedPass = await bcrypt.hash(password, salt);

    const userData = await User.create({
        name,
        password: hashedPass,
        email
    })

    const { password: _, ...safeUserData } = userData.toObject();

    return res.status(201).json(new ApiResponse<any>(201, "User created Succesfully", { safeUserData }));
})

export const login = asyncHandler(async (
    req: Request<{}, {}, loginBody>,
    res: Response
) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please fill all the fields!");
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
        throw new ApiError(400, "User with this email does not exists!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Incorrect Credentials")
    }

    const accessToken = generateAccessToken(String(user._id));

    const refreshToken = generateRefreshToken(String(user._id));

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: envConfig.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

    return res.status(200).json(new ApiResponse(200, "User logged in successfully!", { id: user.id, name: user.name, email: user.email }))
})

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh Token Missing!");
    }

    const isBlackListed = await redisClient.get(`blacklist:${refreshToken}`);

    if (isBlackListed) {
        throw new ApiError(403, "Session revoked. This refresh token is blacklisted!");
    }

    // Callback hata kar try-catch lagaya taaki async errors se server crash na ho
    try {
        const decoded = jwt.verify(
            refreshToken,
            envConfig.REFRESH_TOKEN_SECRET
        ) as CustomJwtPayload;

        if (!decoded || typeof decoded === "string" || !decoded.id) {
            throw new ApiError(403, "Invalid refresh token format");
        }

        // Aapka 'id' perfect use ho raha hai yahan
        const newAccessToken = generateAccessToken(decoded.id);

        res.cookie('accessToken', newAccessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json(
            new ApiResponse(200, "Access token refreshed successfully")
        );

    } catch (error) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }
});

// ==========================================
// 2. LOGOUT CONTROLLER
// ==========================================
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(403, "Refresh token is not available");
    }

    const decoded = jwt.decode(refreshToken);

    if (!decoded || typeof decoded === 'string' || !decoded.exp) {
        throw new ApiError(400, 'Invalid refresh token');
    }

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
        await redisClient.setEx(`blacklist:${refreshToken}`, ttl, 'true');
    }

    // 🔥 FIX: clearCookie mein options dena zaroori hai, nahi toh cookie delete nahi hogi
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res.status(200).json(
        new ApiResponse(200, "User logged out successfully!")
    );
});