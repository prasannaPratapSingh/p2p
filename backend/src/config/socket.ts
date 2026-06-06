import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from './logger.js';

let io: Server;


// function to initialize the socket or upgrade out HTTP server...
export const initSocket = (server: any) => {

    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        // handhshake ya upgrade request ke time hi hum userId le lege 

        const userId = socket.handshake?.query?.userId as String;

        if (userId && userId !== 'undefined') {

            const userRoom = `user_${userId}`;

            socket.join(userRoom);

            logger.info(`📡 Synapse Node Joined Room: ${userRoom} (Socket ID: ${socket.id})`);
        }
        socket.on("disconnect", () => {
            logger.info(`🛑 Socket Disconnected: ${socket.id}`);
        })
        return io;
    })


}

// ab ek helper function banana hoga so that hume baar baar same boilerplate na likhni pade i.e room me message emit karne wala...

export const sendRealTimeNotification = (recipentId: String, payload: any) => {
    if (!io) {
        logger.error("Socket.io server is not initialized. Cannot send real-time notification.");
        return;
    }

    const targetRoom = `user_${recipentId}`;

    io.to(targetRoom).emit("NEW_NOTIFICATION", payload);

    logger.info(`⚡ Synaptic Room Push Delivered to: ${targetRoom}`);

}