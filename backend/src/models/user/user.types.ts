import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string | null;
    avatarUrl: string;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}

