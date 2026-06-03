import { Outlet } from "react-router"
import Navbar from "../features/shared/components/Navbar"


const AppLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default AppLayout