import mongoose, { Schema, model } from "mongoose";
import { NotificationType } from "../notifications/notification.interface.js";
import type { INotification } from "../notifications/notification.interface.js";

const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true 
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        link: {
            type: String
        },
    },
    { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);