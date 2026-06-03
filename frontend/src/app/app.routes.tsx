import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Protected from "../features/auth/components/Protected";

export const routes = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage/>
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Protected>{<h1>Welcome to the protected Route. You are special...</h1>}</Protected>
            }
        ]
    }
])