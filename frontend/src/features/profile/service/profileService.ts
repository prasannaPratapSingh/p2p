import axiosInstance from '../../../lib/authInstance';
import type { Profile } from '../../../types/profile.type';

export const getProfile = async (): Promise<Profile> => {
    try {
        const response = await axiosInstance.get<{ data: Profile }>('/profile/me');
        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching profile', error.message);
        throw error;
    }
};

export const updateSkills = async (skillsToLearn: string[], skillsToTeach: string[]): Promise<any> => {
    try {
        const response = await axiosInstance.put('/skills/update', { skillsToLearn, skillsToTeach });
        return response.data;
    } catch (error: any) {
        console.error('Error updating skills', error.message);
        throw error;
    }
};

export const uploadAvatar = async (file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await axiosInstance.post('/profile/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error uploading avatar', error.message);
        throw error;
    }
};

export const getMatches = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get('/match/dashboard');
        return (response.data as any).data;
    } catch (error: any) {
        console.error('Error fetching matches', error.message);
        throw error;
    }
};
