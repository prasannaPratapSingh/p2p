import { Schema, Document ,Types} from "mongoose";


export interface IWallet extends Document {
    userId: Types.ObjectId;
    balance: number;
    escrowBalance: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}