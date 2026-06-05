import axiosInstance from '../../../lib/authInstance';

export const requestConnection = async (receiverId: string, proposedTime: Date): Promise<any> => {
    try {
        const response = await axiosInstance.post('/connection/request', { receiverId, proposedTime });
        return response.data;
    } catch (error: any) {
        console.error('Error requesting connection', error.message);
        throw error;
    }
};

export const acceptConnection = async (connectionId: string): Promise<any> => {
    try {
        const response = await axiosInstance.post('/connection/accept', { connectionId });
        return response.data;
    } catch (error: any) {
        console.error('Error accepting connection', error.message);
        throw error;
    }
};

export const rejectConnection = async (connectionId: string): Promise<any> => {
    try {
        const response = await axiosInstance.post('/connection/reject', { connectionId });
        return response.data;
    } catch (error: any) {
        console.error('Error rejecting connection', error.message);
        throw error;
    }
};

export const getMyConnections = async (): Promise<any[]> => {
    try {
        const response = await axiosInstance.get('/connection/me');
        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching connections', error.message);
        throw error;
    }
};

export const completeConnection = async (connectionId: string): Promise<any> => {
    try {
        const response = await axiosInstance.post('/connection/complete', { connectionId });
        return response.data;
    } catch (error: any) {
        console.error('Error completing connection', error.message);
        throw error;
    }
};

