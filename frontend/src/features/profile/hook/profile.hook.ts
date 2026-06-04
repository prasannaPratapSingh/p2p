import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, setProfile } from '../state/profile.slice';
import { getProfile } from '../service/profileService';
import type { RootState } from '../../../app/store/app.store';

export const useProfile = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile.profile);
    const loading = useSelector((state: RootState) => state.profile.loading);
    const error = useSelector((state: RootState) => state.profile.error);

    const fetchProfile = async () => {
        try {
            dispatch(setLoading(true));
            const data = await getProfile();
            dispatch(setProfile(data));
            return data;
        } catch (error: any) {
            dispatch(setError(error?.response?.data?.message || error?.message || 'Failed to load profile'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return { profile, loading, error, fetchProfile };
};
