import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
    setNotifications,
    setNotificationLoading,
    setNotificationError,
    markLocalNotificationsRead,
} from "../state/notification.slice";
import {
    fetchNotifications,
    markAllNotificationsRead,
} from "../service/notification.service";

export const useNotifications = () => {
    const dispatch = useDispatch();

    const handleFetchNotifications = useCallback(async () => {
        try {
            dispatch(setNotificationLoading(true));
            const data = await fetchNotifications();
            dispatch(setNotifications(data?.data || []));
            return data;
        } catch (error: any) {
            dispatch(
                setNotificationError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch notifications"
                )
            );
        } finally {
            dispatch(setNotificationLoading(false));
        }
    }, [dispatch]);

    const handleMarkAllRead = useCallback(async () => {
        try {
            dispatch(markLocalNotificationsRead());
            await markAllNotificationsRead();
        } catch (error: any) {
            console.error("Failed to mark notifications as read on server", error);
            dispatch(
                setNotificationError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to mark notifications as read"
                )
            );
        }
    }, [dispatch]);

    return { handleFetchNotifications, handleMarkAllRead };
};
