import type { IConnection } from "./connections.type.js";
import mongoose, { Schema } from 'mongoose';

const connectionSchema = new Schema<IConnection>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true,
            index: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
            default: "pending",
            index: true,
        },
    },
    { timestamps: true }
);

connectionSchema.index({ senderId: 1, receiverId: 1, status: 1 }, { unique: false });

export const Connection = mongoose.model<IConnection>("Connection", connectionSchema);