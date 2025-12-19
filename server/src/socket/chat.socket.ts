import { Server, Socket } from "socket.io";

export const registerChatHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", (roomId: string) => {
            socket.join(roomId);
        });

        socket.on("send-message", ({ roomId, message }) => {
            io.to(roomId).emit("new-message", {
                message,
                sender: socket.id,
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
