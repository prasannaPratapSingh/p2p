import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    avatarUrl: string;
    refreshToken: string | null
    createdAt: Date;
    updatedAt: Date;
}

