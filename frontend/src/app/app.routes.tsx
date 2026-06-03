import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";

export const routes=createBrowserRouter([
    {
        path:"/login",
        element:<h1>Welcome to loginPage</h1>
    },
    {
        path:"/register",
        element:<h1>Welcome to registerPage</h1>
    },
    {
        element:<AppLayout/>,
        children:[
            {
                path:'/',
                element:<h1>Welcome to the homePage</h1>
            }
        ]
    }
])