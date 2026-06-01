import type { Request, Response, NextFunction } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import type { skillPayload } from "./skills.types.js";
import ApiError from "../../utils/ApiError.js";
import { SkillProfile } from "./skills.model.js";

export const skillsUpdate = asyncHandler(async (
    req: Request<{}, {}, skillPayload>,
    res: Response,
    next: NextFunction
) => {

    try {
        const currentUser = req.user;
        const { skillsToLearn, skillsToTeach } = req.body;


        if (!currentUser || !currentUser.id) {
            throw new ApiError(401, "Unauthorized!")
        }


        const updateQuery: any = { lastActiveAt: new Date() };

        if (skillsToLearn !== undefined) {
            if (!Array.isArray(skillsToLearn)) {
                throw new ApiError(400, "skillsToLearn must be an array of strings");
            }

            updateQuery.skillsToLearn = skillsToLearn;
        }

        if (skillsToTeach !== undefined) {
            if (!Array.isArray(skillsToTeach)) {
                throw new ApiError(400, "skillsToTeach must be an array of strings")
            }

            updateQuery.skillsToTeach = skillsToTeach;
        }

        const updateProfile = await SkillProfile.findOneAndUpdate(
            { userId: currentUser.id },
            { $set: updateQuery },
            { returnDocument: "after", upsert: true, runValidators: true }
        )


        if (!updateProfile) {
            throw new ApiError(500, "Something went wrong while synchronizing skills. Please try again after sometime.")
        }

        return res.status(200).json(new ApiResponse(200, "Skills profile synchronized successfully !", updateProfile))

    } catch (error) {
        next(error)
    }

})

export const getMySkills = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const currentUser = req.user;

        if (!currentUser || !currentUser.id) {

            throw new ApiError(401, "User authentication falied. Token missing or invalid!")
        }


        const profile = await SkillProfile.findOne(
            { userId: currentUser.id }
        )

        if (!profile) {
            return res.status(200).json(
                new ApiResponse(200,
                    "User did not saved the skills yet. Returning the empty arrays!",
                    {
                        userId: currentUser.id,
                        skillsToLearn: [],
                        skillsToTeach: []
                    }
                )
            )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Skills profile fetched successfully.",
                    profile
                )
            );


    } catch (error) {
        next(error)
    }

})