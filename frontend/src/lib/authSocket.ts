import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { io, type Socket } from "socket.io-client";


import { addIncomingNotification } from "../features/notifications/state/notification.slice";
import { toast } from "react-hot-toast";

let socket: Socket | null = null;

export const useSocket = () => {

    const dispatch = useDispatch();

    const auth = useSelector((state: any) => state.auth)
    const userId = auth.user?.data?.id;
    console.log(auth);
    


    useEffect(() => {
        if (!userId) {
            if (socket) {
                console.log("🔌 Disconnecting socket: No active userId");
                socket.disconnect();
                socket = null;
            }
            return;
        }

        // If socket is already connected (e.g. from previous user or state), disconnect it
        if (socket) {
            console.log("🔌 Disconnecting old socket connection before reconnecting");
            socket.disconnect();
            socket = null;
        }

        console.log("🔌 Initializing socket connection for userId:", userId);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001';
        socket = io(backendUrl, {
            query: { userId },
            withCredentials: true
        });

        socket.on("connect", () => {
            console.log(`📡 Synapse Node Connected via Custom Hook! ID: ${socket?.id}`);
        });

        socket.on("NEW_NOTIFICATION", (data) => {
            console.log("🔥 Notification Captured in Custom Hook:", data);
            dispatch(addIncomingNotification(data)); // Direct dispatch to notificationSlice
            const senderName = (data.sender && typeof data.sender === "object")
                ? (data.sender.name || "System")
                : (typeof data.sender === "string" ? data.sender : "System");
            toast(`${senderName} ${data.message}`, {
                icon: "🔔",
            });
        });

        socket.on("disconnect", () => {
            console.log("🛑 Socket disconnected cleanly.");
        });

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, [userId, dispatch]);

}