import { useDispatch } from "react-redux"
import type { loginBody, registerBody } from "../../../types/auth.type"
import { setError, setLoading, setUser } from "../state/auth.slice";
import { getMeUuser, login, logout, register } from "../service/authService";

export const useAuth = () => {

    const dispatch = useDispatch();

    const handleRegister = async ({ name, email, password }: registerBody) => {
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
    }

    const handleLogin = async ({ email, password }: loginBody) => {
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
    }

    const handleLogout = async () => {
        try {
            dispatch(setLoading(true));
            await logout();
            dispatch(setUser(null));
            return null;
        } catch (error: any) {
            dispatch(setError(error?.response?.data?.message || error?.message || 'Logout failed'));
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGetMe = async () => {
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
    }

    return { handleLogin, handleLogout, handleRegister, handleGetMe };

}