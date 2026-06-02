import type { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { SkillProfile } from "../skills/skills.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getDashboardMatches = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const currentUser = req.user;
        if (!currentUser || !currentUser.id) {
            throw new ApiError(401, "User authenticatio failed!");
        }

        const myProfile = await SkillProfile.findOne({ userId: currentUser.id });

        if (!myProfile || myProfile.skillsToLearn.length === 0 || myProfile.skillsToTeach.length === 0) {
            return res.status(200).json(new ApiResponse(200, "Please update both your 'skills to teach' and 'skills to learn' to see personalized matches!", []))
        }


        // skills matching algorith...

        const matches = await SkillProfile.find({
            userId: { $ne: currentUser.id },
            skillsToLearn: { $in: myProfile.skillsToTeach },
            skillsToTeach: { $in: myProfile.skillsToLearn }
        })
            .populate("userId", "name email")
            .sort({ lastActiveAt: -1 })


        return res.status(200).json(new ApiResponse(200, `Found ${matches.length} compatible skill-swap peers for you!`, matches))
    } catch (error) {
        next(error);
    }
})