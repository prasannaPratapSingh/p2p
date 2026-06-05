import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProfileState, Profile } from '../../../types/profile.type';

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
    matches: null,
    loadingMatches: false,
    matchesError: null,
    view: 'profile',
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<Profile | null>) => {
            state.profile = action.payload;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setMatches: (state, action: PayloadAction<any[] | null>) => {
            state.matches = action.payload;
            state.matchesError = null;
        },
        setLoadingMatches: (state, action: PayloadAction<boolean>) => {
            state.loadingMatches = action.payload;
        },
        setMatchesError: (state, action: PayloadAction<string | null>) => {
            state.matchesError = action.payload;
        },
        setView: (state, action: PayloadAction<'profile' | 'matches'>) => {
            state.view = action.payload;
        },
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.loading = false;
            state.matches = null;
            state.loadingMatches = false;
            state.matchesError = null;
            state.view = 'profile';
        },
    },
});

export const {
    setProfile,
    setLoading,
    setError,
    setMatches,
    setLoadingMatches,
    setMatchesError,
    setView,
    clearProfile
} = profileSlice.actions;
export default profileSlice.reducer;
