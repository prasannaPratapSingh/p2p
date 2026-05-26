import mongoose, { Schema, Model } from 'mongoose';

import type { IUser } from './user.types.js';

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        refreshToken: { type: String, default: null }
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;