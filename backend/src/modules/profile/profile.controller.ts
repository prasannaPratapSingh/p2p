import type { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { ImageKitService } from "../../infrastructure/imagekit/imagekit.service.js";
import User from "../../models/user/user.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { SkillProfile } from "../skills/skills.model.js";

export const uploadProfileAvatar = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            throw new ApiError(400, "Please provide an avatar image file.");
        }

        const fileName = `avatar-${userId}-${Date.now()}`;
        console.log("after cdnImageUrl");

        const cdnImageUrl = await ImageKitService.uploadBuffer(req.file.buffer, fileName);



        const updateUser = await User.findByIdAndUpdate(
            userId,
            { $set: { avatarUrl: cdnImageUrl } },
            { new: true }
        )
            .select("-password");

        return res
            .status(200)
            .json(new ApiResponse(200, "Avatar updated via ImageKit successfully!", { avatarUrl: cdnImageUrl, user: updateUser }));

    } catch (error) {
        next(error);
    }
})

export const getMyProfile = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "Unauhorized access blocked. UserId not provided.")
    }

    let responsePayload = {};

    const userData = await User.findById(userId).select("-password -refreshToken -__v").lean();


    const userSkillData = await SkillProfile.findOne({ userId }).select("-_id -__V -createdAt -lastActiveAt");


    responsePayload = { ...userData, userSkillData };


    res.status(200).json( new ApiResponse(200,"Data fetched",responsePayload) );

})