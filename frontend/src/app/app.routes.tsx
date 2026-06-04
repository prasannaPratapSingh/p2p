import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";
import LandingPage from "../features/shared/pages/LandingPage";
import DashboardPage from "../features/shared/pages/DashboardPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Protected from "../features/auth/components/Protected";
import PublicRoute from "../features/auth/components/PublicRoute";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        )
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <RegisterPage />
            </PublicRoute>
        )
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/dashboard",
                element: (
                    <Protected>
                        <DashboardPage />
                    </Protected>
                )
            }
        ]
    }
]);