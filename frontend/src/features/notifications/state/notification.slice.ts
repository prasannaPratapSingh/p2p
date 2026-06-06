import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface INotification {
    _id: string;
    recipient: string;
    sender: {
        _id: string;
        name: string;
        avatarUrl?: string;
    } | string;
    type: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    list: INotification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    list: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

export const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<INotification[]>) => {
            state.list = action.payload;
            state.unreadCount = action.payload.filter((n) => !n.isRead).length;
        },
        setNotificationLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setNotificationError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        addIncomingNotification: (state, action: PayloadAction<INotification>) => {
            state.list.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        markLocalNotificationsRead: (state) => {
            state.list = state.list.map((n) => ({ ...n, isRead: true }));
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.list = [];
            state.unreadCount = 0;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setNotifications,
    setNotificationLoading,
    setNotificationError,
    addIncomingNotification,
    markLocalNotificationsRead,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
