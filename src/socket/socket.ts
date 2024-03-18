import { Server } from "socket.io";
import http from "http";
import express from "express";
import connect from '../config/db';
import { ResultSetHeader, RowDataPacket } from "mysql2";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const userSocketMap: { [key: string]: string } = {}; // userId: socketId
const getRecipientSocketId = (recipientId: string | number) => {
	return userSocketMap[recipientId];
};

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.user_id as string;

    if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("markMessagesAsSeen", async ({ conversation_id, user_id }) => {
        try {
            let conn = await connect();
            let [lastmessage] = await conn.query<RowDataPacket[]>("SELECT * FROM Message WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1", [conversation_id]);
            if (lastmessage.length > 0) {
                let [updatemsg] = await conn.query<ResultSetHeader>("UPDATE Message SET seen = ? WHERE msg_id = ?", [true, lastmessage[0].msg_id]);
                let [updateConversation] = await conn.query<ResultSetHeader>("UPDATE Conversation SET seen = ? WHERE conversation_id = ?", [true, conversation_id]);
                io.to(userSocketMap[user_id]).emit("messagesSeen", { conversation_id });
            }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app, getRecipientSocketId };









































