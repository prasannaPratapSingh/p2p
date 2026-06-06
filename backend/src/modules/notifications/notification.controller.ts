import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { Notification } from "../../models/notifications/notification.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getUserNotification = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError(400, "UserID does not exist")
        }

        const notification = await Notification.find({ recipient: userId })
            .populate("sender", "name avatarUrl")
            .sort({ createdAt: -1 })
            .limit(10);

        if (notification.length === 0) {
            return res.status(200).json(new ApiResponse(200, "No notifications yet", []));
        }
        return res.status(200).json(new ApiResponse(200, "Notifications Fetched Successfully", notification));
    } catch (error) {
        next(error);
    }
})

export const markAsRead = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError(400, "UserID does not exist")
        }

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        )

        return res.status(200).json(new ApiResponse(200, "Your all notifications marked as read!"));

    } catch (error) {
        next(error);
    }
})