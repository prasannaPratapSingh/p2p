import { Schema, Document } from "mongoose";


export interface IWallet extends Document {
    userId: Schema.Types.ObjectId;
    balance: number;
    escrowBalance: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}