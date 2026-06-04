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
