import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ConnectionsState {
    connections: any[] | null;
    loading: boolean;
    error: string | null;
    requesting: boolean;
    requestError: string | null;
}

const initialState: ConnectionsState = {
    connections: null,
    loading: false,
    error: null,
    requesting: false,
    requestError: null,
};

const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        setConnections: (state, action: PayloadAction<any[] | null>) => {
            state.connections = action.payload;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setRequesting: (state, action: PayloadAction<boolean>) => {
            state.requesting = action.payload;
        },
        setRequestError: (state, action: PayloadAction<string | null>) => {
            state.requestError = action.payload;
        },
        clearConnections: (state) => {
            state.connections = null;
            state.loading = false;
            state.error = null;
            state.requesting = false;
            state.requestError = null;
        },
    },
});

export const {
    setConnections,
    setLoading,
    setError,
    setRequesting,
    setRequestError,
    clearConnections
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
