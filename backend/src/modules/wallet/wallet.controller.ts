import type { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { WalletModel } from "./wallet.model.js";

export const getMyWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.user as any;


        if (!currentUser || !currentUser.id) {
            throw new ApiError(401, "User authentication failed. Access token is invalid.");
        }


        let wallet = await WalletModel.findOne({ userId: currentUser.id });


        if (!wallet) {
            wallet = await WalletModel.create({
                userId: currentUser.id,
                balance: 3.0,
                escrowBalance: 0.0
            });

            if (!wallet) {
                throw new ApiError(500, "Failed to initialize wallet for the user.");
            }
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Wallet details retrieved successfully.",
                    { wallet },
                )
            );

    } catch (error) {

        next(error);
    }
};