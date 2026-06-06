import axiosInstance from "../../../lib/authInstance";

export const fetchNotifications = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get('/notification/');
        return response.data;
    } catch (error: any) {
        console.error("Error fetching notifications from service layer", error.message);
        throw error;
    }
}

export const markAllNotificationsRead = async (): Promise<any> => {
    try {
        const response = await axiosInstance.post('/notification/mark-read-all');
        return response.data;
    } catch (error: any) {
        console.error("Error marking notifications as read from service layer", error.message);
        throw error;
    }
}
