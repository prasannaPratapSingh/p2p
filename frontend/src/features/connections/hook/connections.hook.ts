import { useDispatch, useSelector } from 'react-redux';
import {
    setConnections,
    setLoading,
    setError,
    setRequesting,
    setRequestError
} from '../state/connections.slice';
import {
    requestConnection,
    acceptConnection,
    rejectConnection,
    getMyConnections,
    completeConnection
} from '../service/connectionsService';
import type { RootState } from '../../../app/store/app.store';

export const useConnections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((state: RootState) => state.connections.connections);
    const loading = useSelector((state: RootState) => state.connections.loading);
    const error = useSelector((state: RootState) => state.connections.error);
    const requesting = useSelector((state: RootState) => state.connections.requesting);
    const requestError = useSelector((state: RootState) => state.connections.requestError);

    const fetchMyConnections = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getMyConnections();
            dispatch(setConnections(data));
            return data;
        } catch (err: any) {
            dispatch(setError(err?.response?.data?.message || err?.message || 'Failed to fetch connections'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRequestConnection = async (receiverId: string, proposedTime: Date) => {
        try {
            dispatch(setRequesting(true));
            dispatch(setRequestError(null));
            const data = await requestConnection(receiverId, proposedTime);
            return data;
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Failed to request connection';
            dispatch(setRequestError(msg));
            throw err;
        } finally {
            dispatch(setRequesting(false));
        }
    };

    const handleAcceptConnection = async (connectionId: string) => {
        try {
            dispatch(setLoading(true));
            await acceptConnection(connectionId);
            // Refresh connections list
            await fetchMyConnections();
        } catch (err: any) {
            dispatch(setError(err?.response?.data?.message || err?.message || 'Failed to accept connection'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRejectConnection = async (connectionId: string) => {
        try {
            dispatch(setLoading(true));
            await rejectConnection(connectionId);
            // Refresh connections list
            await fetchMyConnections();
        } catch (err: any) {
            dispatch(setError(err?.response?.data?.message || err?.message || 'Failed to reject connection'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleCompleteConnection = async (connectionId: string) => {
        try {
            dispatch(setLoading(true));
            await completeConnection(connectionId);
            // Refresh connections list
            await fetchMyConnections();
        } catch (err: any) {
            dispatch(setError(err?.response?.data?.message || err?.message || 'Failed to complete connection'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        connections,
        loading,
        error,
        requesting,
        requestError,
        fetchMyConnections,
        handleRequestConnection,
        handleAcceptConnection,
        handleRejectConnection,
        handleCompleteConnection
    };
};
