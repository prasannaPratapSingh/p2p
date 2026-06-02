import mongoose, { Document, Types } from "mongoose";
export interface IConnection extends Document {
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    status: "pending" | "accepted" | "rejected" | "completed" | "cancelled",
    createdAt: Date,
    updatedAt: Date,
    proposedTime: Date,
    scheduledTime?: Date,
    meetingLink?: string,
    meetingRoomId?: string


}

export interface connectionRequest {
    receiverId: string
    proposedTime:Date
}

export interface acceptConnectionRequest {
    connectionId: Types.ObjectId,
    action: "accepted" | "rejected"
}