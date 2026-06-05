import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, setProfile, setMatches, setLoadingMatches, setMatchesError, setView } from '../state/profile.slice';
import { setUser } from '../../auth/state/auth.slice';
import { getProfile, updateSkills, uploadAvatar, getMatches } from '../service/profileService';
import type { RootState } from '../../../app/store/app.store';

export const useProfile = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile.profile);
    const loading = useSelector((state: RootState) => state.profile.loading);
    const error = useSelector((state: RootState) => state.profile.error);
    const matches = useSelector((state: RootState) => state.profile.matches);
    const loadingMatches = useSelector((state: RootState) => state.profile.loadingMatches);
    const matchesError = useSelector((state: RootState) => state.profile.matchesError);
    const view = useSelector((state: RootState) => state.profile.view);
    const user = useSelector((state: RootState) => state.auth.user);

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

    const handleUpdateSkills = async (skillsToLearn: string[], skillsToTeach: string[]) => {
        try {
            dispatch(setLoading(true));
            await updateSkills(skillsToLearn, skillsToTeach);
            // Refresh profile data
            const data = await getProfile();
            dispatch(setProfile(data));
            return data;
        } catch (error: any) {
            dispatch(setError(error?.response?.data?.message || error?.message || 'Failed to update skills'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUploadAvatar = async (file: File) => {
        try {
            dispatch(setLoading(true));
            const uploadResponse = await uploadAvatar(file);
            
            // Refresh profile data
            const data = await getProfile();
            dispatch(setProfile(data));
            
            // Update user in auth state so navbar avatar updates immediately
            if (user && uploadResponse?.data?.avatarUrl) {
                dispatch(setUser({
                    ...user,
                    data: {
                        ...user.data,
                        avatarUrl: uploadResponse.data.avatarUrl
                    }
                }));
            }
            
            return data;
        } catch (error: any) {
            dispatch(setError(error?.response?.data?.message || error?.message || 'Failed to upload avatar'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchMatches = async () => {
        try {
            dispatch(setLoadingMatches(true));
            dispatch(setMatchesError(null));
            const data = await getMatches();
            dispatch(setMatches(data));
            return data;
        } catch (error: any) {
            dispatch(setMatchesError(error?.response?.data?.message || error?.message || 'Failed to fetch matches'));
            throw error;
        } finally {
            dispatch(setLoadingMatches(false));
        }
    };

    const handleSetView = (newView: 'profile' | 'matches') => {
        dispatch(setView(newView));
    };

    return {
        profile,
        loading,
        error,
        matches,
        loadingMatches,
        matchesError,
        view,
        fetchProfile,
        handleUpdateSkills,
        handleUploadAvatar,
        fetchMatches,
        handleSetView
    };
};
