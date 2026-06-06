import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { io, type Socket } from "socket.io-client";


let socket: Socket | null = null;

export const useSocket = () => {

    const dispatch = useDispatch();

    const auth = useSelector((state: any) => state.auth)
    const userId = auth.user?.data?.id;
    console.log(auth);
    


    useEffect(() => {
        if (!userId) {
            if (socket) {
                socket.disconnect();
                socket = null;

            }
        }


        if (!socket) {
            socket = io('http://localhost:4001', {
                query: { userId },
                withCredentials: true
            });
            socket.on("connect", () => {
                console.log(`📡 Synapse Node Connected via Custom Hook! ID: ${socket?.id}`);
            });

            socket.on("NEW_NOTIFICATION", (data) => {
                console.log("🔥 Notification Captured in Custom Hook:", data);
                // dispatch(addIncomingNotification(data)); // Direct dispatch to notificationSlice
            });

            socket.on("disconnect", () => {
                console.log("🛑 Socket disconnected cleanly.");
            });

            return () => {
                if (userId) {
                    if (socket) {
                        socket.disconnect();
                        socket = null;
                    }
                }
            }

        }
    }, [userId, dispatch])

}