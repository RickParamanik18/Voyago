import { Server, Socket } from "socket.io";

export const registerChatHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", ({ roomId, name }) => {
            socket.join(roomId);
            console.log(`${name} joined room: ${roomId}`);
        });

        socket.on("send-message", ({ roomId, message, sender }) => {
            console.log(`Message from ${sender} to room ${roomId}: ${message}`);
            socket.to(roomId).emit("new-message", {
                message,
                sender,
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
