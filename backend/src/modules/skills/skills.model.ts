import mongoose, { Model, Schema } from "mongoose";
import type { ISkillProfile } from "./skills.types.js";

const SkillProfileSchema: Schema<ISkillProfile> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        skillsToLearn: [
            {
                type: String,
                lowercase: true,
                trim: true
            }
        ],
        skillsToTeach: [
            {
                type: String,
                lowercase: true,
                trim: true
            }
        ],
        rating: {
            type: Number,
            default: 5.0,
            min: 1.0,
            max: 5.0
        },
        totalSessionsCompleted: {
            type: Number,
            default: 0
        },
        activityScore: {
            type: Number,
            default: 50, // Starts at baseline 50/100
            min: 0,
            max: 100
        },
        lastActiveAt: {
            type: Date,
            default: Date.now
        }
    }, { timestamps: true },
)


SkillProfileSchema.index({ skillsToTeach: 1 });
SkillProfileSchema.index({ skillsToLearn: 1 });
SkillProfileSchema.index({ rating: -1, activityScore: -1 });

export const SkillProfile: Model<ISkillProfile> = mongoose.model('SkillProfile', SkillProfileSchema);