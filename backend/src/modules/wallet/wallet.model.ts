import mongoose, { Schema, Model } from "mongoose";
import type { IWallet } from "./wallet.types.js";

const walletSchema = new Schema<IWallet>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        balance: {
            type: Number,
            required: true,
            default: 3.0,
            min: [0, 'Balance negative nahi ho sakta']
        },
        escrowBalance: {
            type: Number,
            required: true,
            default: 0.0,
            min: [0, 'Escrow balance negative nahi ho sakta']
        },
        currency: {
            type: String,
            default: 'SKILL_CREDIT',
            enum: ['SKILL_CREDIT', 'INR', 'USD']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

walletSchema.index({ userId: 1, isActive: 1 });

export const WalletModel: Model<IWallet> = mongoose.model('Wallet', walletSchema)