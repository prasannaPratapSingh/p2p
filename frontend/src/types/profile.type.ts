export interface UserSkillData {
    userId: string;
    __v: number;
    activityScore: number;
    rating: number;
    skillsToLearn: string[];
    skillsToTeach: string[];
    totalSessionsCompleted: number;
    updatedAt: string;
}

export interface Profile {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    avatarUrl: string;
    userSkillData: UserSkillData;
}

export interface ProfileState {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
}
