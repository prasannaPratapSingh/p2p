import { useDispatch } from "react-redux"
import { useCallback } from "react";
import type { loginBody, registerBody } from "../../../types/auth.type"
import { setError, setLoading, setUser } from "../state/auth.slice";
import { clearProfile } from '../../profile/state/profile.slice';
import { getMeUuser, login, logout, register } from "../service/authService";

export const useAuth = () => {

    const dispatch = useDispatch();

    const handleRegister = useCallback(async ({ name, email, password }: registerBody) => {
        try {
            dispatch(setLoading(true));

            const data = await register({ name, email, password });
            return data;
        } catch (error: any) {
            dispatch(setError(error?.response?.data?.message || error?.message || 'Registration failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ email, password }: loginBody) => {
        try {
            dispatch(setLoading(true));
            const data = await login({ email, password });
            dispatch(setUser(data));
            return data;
        } catch (error: any) {
            dispatch(setError(error?.response?.data?.message || error?.message || 'Login failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            await logout();
        } catch (error: any) {
            console.error("Logout API failed", error);
            dispatch(setError(error?.response?.data?.message || error?.message || 'Logout failed'));
        } finally {
            dispatch(setUser(null));
            dispatch(clearProfile());
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMe = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await getMeUuser();
            dispatch(setUser(data));
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Failed to fetch user';
            if (error?.response?.status === 401) {
                dispatch(setError(null));
            } else {
                dispatch(setError(message));
            }
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return { handleLogin, handleLogout, handleRegister, handleGetMe };

}