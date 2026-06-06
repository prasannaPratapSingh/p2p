import { Outlet } from "react-router"
import Navbar from "../features/shared/components/Navbar"
import { useSocket } from "../lib/authSocket"


const AppLayout = (): React.ReactNode => {
    useSocket();
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default AppLayout