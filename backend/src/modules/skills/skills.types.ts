import { Schema, Document } from "mongoose";

export interface ISkillProfile extends Document {
    userId: Schema.Types.ObjectId;
    skillsToLearn: string[];
    skillsToTeach: string[];
    rating: number;
    totalSessionsCompleted: number;
    activityScore: number;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface skillPayload {
    skillsToLearn?: string[],
    skillsToTeach?: string[] 
}