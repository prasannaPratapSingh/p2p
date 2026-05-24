import type { Response, Request } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { registerBody } from "./auth.type.js";
import ApiError from "../../utils/ApiError.js";
import bcrypt from "bcryptjs";
import envConfig from "../../config/envConfig.js";
import User from "../user/user.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const salt = envConfig.SALT_VALUE;

const register = asyncHandler(async (
    req: Request<{}, {}, registerBody>,
    res: Response) => {
    const { email, password, name } = req.body;



    if (!email || !password || !name) {
        throw new ApiError(400, "Fill all the fields");
    }

    const userAlreadyExists = await User.findOne({
        $or: [
            { name },
            { email }
        ]
    })


    if (userAlreadyExists) {
        throw new ApiError(403, "User with the email or name already exists!")
    };


    const hashedPass = await bcrypt.hash(password, salt);

    const userData = await User.create({
        name,
        password: hashedPass,
        email
    })

    const { password: _, ...safeUserData } = userData.toObject();

    return res.status(201).json(new ApiResponse<any>(201, "User created Succesfully", { safeUserData }));
})

export default register;