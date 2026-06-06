import { Document, Types } from "mongoose";

export enum NotificationType {
    SWAP_REQUEST = "SWAP_REQUEST",
    SWAP_ACCEPT = "SWAP_ACCEPT",
    SWAP_CANCEL = "SWAP_CANCEL",
    WALLET_CREDIT = "WALLET_CREDIT",
}

export interface INotification extends Document {
    recipient: Types.ObjectId;
    sender: Types.ObjectId;
    type: NotificationType;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}