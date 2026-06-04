import type { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { acceptConnectionRequest, connectionRequest } from "./connections.type.js";
import ApiError from "../../utils/ApiError.js";
import { SkillProfile } from "../skills/skills.model.js";
import { Connection } from "../connections/controller.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { WalletModel } from "../wallet/wallet.model.js";
import { logger } from "../../config/logger.js";
import getJitsiMeetingLink from "./connections.utils.js";

export const sendConnectionRequest = asyncHandler(async (
    req: Request<{}, {}, connectionRequest>,
    res: Response,
    next: NextFunction
) => {
    try {
        const senderId = req.user.id;
        const { receiverId, proposedTime } = req.body;

        if (!receiverId || !proposedTime) {
            throw new ApiError(400, "Receiver identity and propposed time is required.");
        }

        const meetingDate = new Date(proposedTime);
        if (isNaN(meetingDate.getTime()) || meetingDate <= new Date()) {
            throw new ApiError(400, "Proposed time must be a valid future date.");
        }



        if (senderId.toString() === receiverId.toString()) {
            throw new ApiError(400, "You cannot send swap-request to yoursel");
        }

        const targetProfile = await SkillProfile.findOne({ userId: receiverId });

        if (!targetProfile) {
            throw new ApiError(404, "Target user does not have a skill profile. They need to create one before you can send a connection request.");
        }

        // calendar check 
        const MEETING_WINDOW_LIMIT = 60 * 60 * 1000;
        const bufferStart = new Date(meetingDate.getTime() - MEETING_WINDOW_LIMIT);
        const bufferEnd = new Date(meetingDate.getTime() + MEETING_WINDOW_LIMIT);

        const senderConflict = await Connection.findOne({
            status: "accepted",
            $or: [{ senderId: senderId }, { receiverId: receiverId }],
            proposedTime: { $gt: bufferStart, $lt: bufferEnd }
        })

        if (senderConflict) {
            throw new ApiError(400, "You have another swap session scheduled around this time slot.");
        }

        const receiverConflict = await Connection.findOne({
            status: "accepted",
            $or: [{ senderId: receiverId }, { receiverId: receiverId }],
            scheduledTime: { $gt: bufferStart, $lt: bufferEnd }
        });
        if (receiverConflict) {
            throw new ApiError(400, "This peer is already booked for another session in this time window.");
        }

        const existingConnection = await Connection.findOne({
            $or: [
                { senderId: senderId, receiverId: receiverId, status: { $in: ["pending", "accepted"] } },
                { senderId: receiverId, receiverId: senderId, status: { $in: ["pending", "accepted"] } }
            ]
        });

        if (existingConnection) {
            throw new ApiError(
                400,
                existingConnection.status === "pending"
                    ? "A connection request is already pending between you two."
                    : "An active swap connection already exists between you two."
            );
        }

        const newRequest = await Connection.create({
            senderId,
            receiverId,
            proposedTime: meetingDate,
            status: "pending"
        })

        return res.status(201).json(new ApiResponse(201, "Skill-swap connection request dispatched successfully!", newRequest));
    }
    catch (error) {
        next(error);
    }


})

export const respondToConnectionRequest = asyncHandler(async (
    req: Request<{}, {}, acceptConnectionRequest>,
    res: Response,
    next: NextFunction
) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const receiverId = req.user.id;
        const { connectionId, action } = req.body;

        if (!connectionId || !action) {
            throw new ApiError(400, "Connection identity and action are required.");
        }

        if (!["accepted", "rejected"].includes(action)) {
            throw new ApiError(400, "Invalid action. Must be 'accepted' or 'rejected'.");
        }

        const connection = await Connection.findOne({
            _id: connectionId,
            receiverId: receiverId,
            status: "pending"
        }).session(session);

        if (!connection) {
            throw new ApiError(404, "Pending connection request not found or unauthorized.");
        }

        if (action === 'rejected') {
            connection.status = 'rejected';
            await connection.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res
                .status(200)
                .json(new ApiResponse(200, "Connection request declined successfully.", connection));
        }


        const ONE_HOUR = 60 * 60 * 1000;
        const bufferStart = new Date(connection.proposedTime.getTime() - ONE_HOUR);
        const bufferEnd = new Date(connection.proposedTime.getTime() + ONE_HOUR);

        const absoluteConflict = await Connection.findOne({
            status: "accepted",
            $or: [
                { senderId: connection.senderId }, { receiverId: connection.senderId },
                { senderId: receiverId }, { receiverId: receiverId }
            ],
            scheduledTime: { $gt: bufferStart, $lt: bufferEnd }
        }).session(session);

        if (absoluteConflict) {
            throw new ApiError(400, "Concurrency Lock: One of the participants is no longer free in this slot.");
        }



        const senderWallet = await WalletModel.findOne({ userId: connection.senderId }).session(session);
        const receiverWallet = await WalletModel.findOne({ userId: receiverId }).session(session);

        if (!senderWallet || !receiverWallet) {
            throw new ApiError(404, "One of the peer wallets is not initialized.");
        }

        if (senderWallet.balance < 1.0) {
            throw new ApiError(400, "The request sender does not have enough tokens to start the swap.");
        }
        if (receiverWallet.balance < 1.0) {
            throw new ApiError(400, "You need at least 1.0 token in your wallet to accept this skill-swap.");
        }

        senderWallet.balance -= 1.0;
        senderWallet.escrowBalance += 1.0;
        await senderWallet.save({ session });

        receiverWallet.balance -= 1.0;
        receiverWallet.escrowBalance += 1.0;
        await receiverWallet.save({ session });



        // yaha se ab jitsi ka integration karna hai, meeting room create karna hai, link generate karna hai, aur connection document me save karna hai proposed time ke hisab se.

        const { meetingLink, meetingRoomId } = getJitsiMeetingLink(connection.id);

        logger.info(meetingLink, meetingRoomId);

        connection.status = "accepted";
        connection.scheduledTime = connection.proposedTime;
        connection.meetingRoomId = meetingRoomId;
        connection.meetingLink = meetingLink;
        await connection.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Swap request accepted! 1.0 token from both peers has been securely locked in escrow.",
                    { connection, senderWalletBalance: senderWallet.balance, myWalletBalance: receiverWallet.balance },
                )
            );

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

})

export const completeConnectionSwap = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const currentUserId = req.user.id;
        const { connectionId } = req.body;

        if (!connectionId) {
            throw new ApiError(400, "Connection identity is required.");
        }

        const connection = await Connection.findOne({
            _id: connectionId,
            status: "accepted",
            $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
        }).session(session);

        if (!connection) {
            throw new ApiError(404, "Active connection swap not found or you are not a participant.");
        }

        const senderWallet = await WalletModel.findOne({ userId: connection.senderId }).session(session);
        const receiverWallet = await WalletModel.findOne({ userId: connection.receiverId }).session(session);

        if (!senderWallet || !receiverWallet) {
            throw new ApiError(404, "Peer wallets not found during settlement.");
        }

        if (senderWallet.escrowBalance < 1.0 || receiverWallet.escrowBalance < 1.0) {
            throw new ApiError(400, "Escrow balances are corrupted or insufficient for settlement.");
        }

        senderWallet.escrowBalance -= 1.0;
        receiverWallet.balance += 1.0;

        receiverWallet.escrowBalance -= 1.0;
        senderWallet.balance += 1.0;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        connection.status = "completed";
        await connection.save({ session });

        await session.commitTransaction();
        session.endSession();
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Skill-swap ledger settled successfully! Tokens released from escrow to peer balances.",
                    {
                        connectionStatus: connection.status,
                        senderWallet: { balance: senderWallet.balance, escrow: senderWallet.escrowBalance },
                        receiverWallet: { balance: receiverWallet.balance, escrow: receiverWallet.escrowBalance }
                    },
                )
            );


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
})

//MY CONNECTIONS - FINDS ALL THE CONNECTIONS WITH STATUS ACCEPTED.

export const getMyConnections = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUserId = req.user.id;

        if (!currentUserId) {
            throw new ApiError(401, "Unauthorized.");
        }

        const connections = await Connection.find({
            $or: [
                { senderId: currentUserId },
                { receiverId: currentUserId }
            ]
        })
            .populate("senderId", "name email")
            .populate("receiverId", "name email")
            .sort({ createdAt: -1 });


        return res.status(200).json(
            new ApiResponse(
                200,
                "Connections fetched successfully.",
                connections
            )
        );
    } catch (error) {
        next(error);
    }
});

export const getAllConnections = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const connections = await Connection.find({})
            .populate("senderId", "name email")
            .populate("receiverId", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(
                200,
                "All connections fetched successfully.",
                connections
            )
        );
    } catch (error) {
        next(error);
    }
});

export const cancelConnection = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const userId = req.user.id;
        const { connectionId } = req.body;

        if (!userId) {
            throw new ApiError(400, "UserID not provided!");
        }

        if (!connectionId) {
            throw new ApiError(400, "ConnectioID is not given!");
        }

        const targetMeeting = await Connection.findOneAndUpdate({ _id: connectionId, senderId: userId, status: "pending" }, { status: "cancelled" });

        if (!targetMeeting) {
            throw new ApiError(400, "No such meeting exists!");
        }

        return res.status(200).json(new ApiResponse(200, "Your current connection cancelled successfully", []));
    } catch (error) {
        next(error);
    }

})