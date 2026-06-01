import mongoose, { Document, Types } from "mongoose";
export interface IConnection extends Document {
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    status: "pending" | "accepted" | "rejected" | "completed" | "cancelled",
    createdAt: Date,
    updatedAt: Date

}

export interface connectionRequest {
    receiverId: string
}

export interface acceptConnectionRequest {
    connectionId: Types.ObjectId,
    action: "accepted" | "rejected"
}