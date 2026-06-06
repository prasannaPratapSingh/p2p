import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../../features/auth/state/auth.slice';
import profileReducer from '../../features/profile/state/profile.slice';
import connectionsReducer from '../../features/connections/state/connections.slice';
import notificationReducer from '../../features/notifications/state/notification.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        connections: connectionsReducer,
        notifications: notificationReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
