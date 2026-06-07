import type { Response, Request, CookieOptions, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { loginBody, registerBody } from "./auth.type.js";
import ApiError from "../../utils/ApiError.js";
import bcrypt from "bcryptjs";
import envConfig from "../../config/envConfig.js";
import User from "../../models/user/user.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { generateAccessToken, generateRefreshToken } from "./auth.utils.js";
import { WalletModel } from "../wallet/wallet.model.js";
import { redisClient } from "../../infrastructure/redis/redis.js";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from "jsonwebtoken";
import userModel from "../../models/user/user.model.js";
import config from "../../config/envConfig.js"
const salt = envConfig.SALT_VALUE;

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

const cookieOptions = {
    httpOnly: true,
    secure: envConfig.NODE_ENV === 'production',
    sameSite: envConfig.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
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

    // Auto-create wallet for the newly registered user
    await WalletModel.create({
        userId: userData._id,
        balance: 3.0,
        escrowBalance: 0.0
    });

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

    // refreshToken ko db me save krlo

    const hashedRefreshToken = await bcrypt.hash(refreshToken, envConfig.SALT_VALUE);

    user.refreshToken = hashedRefreshToken;
    await user.save();

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: envConfig.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

    return res.status(200).json(new ApiResponse(200, "User logged in successfully!", { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }));
})

export const refreshToken =
    asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const refreshToken =
                req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new ApiError(
                    401,
                    'Refresh token missing'
                );
            }

            // Check blacklist

            const isBlacklisted =
                await redisClient.get(
                    `blacklist:${refreshToken}`
                );

            if (isBlacklisted) {
                throw new ApiError(
                    403,
                    'Session revoked'
                );
            }

            try {
                // Verify refresh token

                const decoded =
                    jwt.verify(
                        refreshToken,
                        envConfig.REFRESH_TOKEN_SECRET
                    ) as CustomJwtPayload;

                // Find user

                const currUser =
                    await User.findById(
                        decoded.id
                    );

                if (!currUser) {
                    throw new ApiError(
                        404,
                        'User not found'
                    );
                }

                // Ensure refresh token exists in DB

                if (
                    !currUser.refreshToken
                ) {
                    throw new ApiError(
                        403,
                        'No active session found'
                    );
                }

                // Compare incoming token
                // with hashed DB token

                const isRefreshTokenValid =
                    await bcrypt.compare(
                        refreshToken,
                        currUser.refreshToken
                    );

                if (
                    !isRefreshTokenValid
                ) {
                    throw new ApiError(
                        403,
                        'Refresh token compromised'
                    );
                }

                // TOKEN ROTATION

                // Blacklist old refresh token

                const ttl =
                    decoded.exp! -
                    Math.floor(
                        Date.now() / 1000
                    );

                if (ttl > 0) {
                    await redisClient.setEx(
                        `blacklist:${refreshToken}`,
                        ttl,
                        'true'
                    );
                }

                // Generate NEW tokens

                const newAccessToken =
                    generateAccessToken(
                        decoded.id
                    );

                const newRefreshToken =
                    generateRefreshToken(
                        decoded.id
                    );

                // Hash NEW refresh token

                const hashedRefreshToken =
                    await bcrypt.hash(
                        newRefreshToken,
                        envConfig.SALT_VALUE
                    );

                // Save NEW hashed token in DB

                currUser.refreshToken =
                    hashedRefreshToken;

                await currUser.save();

                // Set cookies

                res.cookie(
                    'accessToken',
                    newAccessToken,
                    {
                        ...cookieOptions,
                        maxAge:
                            15 *
                            60 *
                            1000
                    }
                );

                res.cookie(
                    'refreshToken',
                    newRefreshToken,
                    {
                        ...cookieOptions,
                        maxAge:
                            7 *
                            24 *
                            60 *
                            60 *
                            1000
                    }
                );

                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            'Access token refreshed successfully'
                        )
                    );
            } catch (error) {
                if (
                    error instanceof
                    ApiError
                ) {
                    throw error;
                }

                throw new ApiError(
                    403,
                    'Invalid or expired refresh token'
                );
            }
        }
    );

export const logout = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {
        const refreshToken =
            req.cookies?.refreshToken;

        // Even if token is missing,
        // clear cookies anyway

        if (!refreshToken) {
            res.clearCookie(
                'accessToken',
                cookieOptions
            );

            res.clearCookie(
                'refreshToken',
                cookieOptions
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    'User logged out successfully!'
                )
            );
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                envConfig.REFRESH_TOKEN_SECRET
            ) as CustomJwtPayload;

            const currUser =
                await User.findById(
                    decoded.id
                );

            if (currUser) {
                currUser.refreshToken =
                    null;

                await currUser.save();
            }

            const ttl =
                decoded.exp! -
                Math.floor(
                    Date.now() / 1000
                );

            if (ttl > 0) {
                await redisClient.setEx(
                    `blacklist:${refreshToken}`,
                    ttl,
                    'true'
                );
            }
        } catch {
            // ignore token verification errors
            // logout should still succeed
        }

        res.clearCookie(
            'accessToken',
            cookieOptions
        );

        res.clearCookie(
            'refreshToken',
            cookieOptions
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                'User logged out successfully!'
            )
        );
    }
);

export const getMe = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        if (!req.user) {
            throw new ApiError(401, "Not authenticated!");
        }
        const userId = req.user.id;
        if (!userId) {
            throw new ApiError(400, "UserId not found!");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(400, "No such user exists!");
        }
        return res.status(200).json(new ApiResponse(200, "User data fetched successfully!", { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }));

    } catch (error) {
        next(error);
    }

})

export const googleCallback = asyncHandler(
    async (req: Request, res: Response) => {
        const CLIENT_URL = config.CLIENT_URL;
        try {
            if (!req.user) {
                return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
            }
            const email = req.user.emails?.[0]?.value;
            if (!email) {
                return res.redirect(`${CLIENT_URL}/login?error=no_email`);
            }
            const name: string = req.user.displayName || "";
            const avatarUrl: string = (req.user as any).photos?.[0]?.value || "";

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    email,
                    name,
                    avatarUrl,
                });

                // Auto-create wallet for the newly registered Google user
                await WalletModel.create({
                    userId: user._id,
                    balance: 3.0,
                    escrowBalance: 0.0
                });
            }

            const accessToken = generateAccessToken(
                String(user._id)
            );

            const refreshToken = generateRefreshToken(
                String(user._id)
            );

            const hashedRefreshToken = await bcrypt.hash(
                refreshToken,
                envConfig.SALT_VALUE
            );

            user.refreshToken = hashedRefreshToken;
            await user.save();

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });


            res.redirect(`${CLIENT_URL}`);
        } catch (error) {
            console.error(error);
            res.redirect(`${CLIENT_URL}/login?error=oauth_failed`);
        }
    }
);
