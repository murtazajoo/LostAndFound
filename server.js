import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { connectDb } from './db/db.js';
import messages from './models/messages.js';
import room from './models/room.js';
import authRouter from './routes/auth.js';
import ChatRouter from './routes/chat.js';
import itemRouter from './routes/item.js';
import mailRouter from './routes/mail.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', itemRouter);
app.use('/mail/', mailRouter);
app.use('/', ChatRouter);


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

connectDb();

const activeUsers = new Map();

io.on('connection', (socket) => {

    socket.on('register', (userId) => {
        activeUsers.set(userId, socket.id);
        io.emit('activeUsers', Array.from(activeUsers.keys()));
    });

    socket.on('disconnect', () => {
        for (const [userId, sId] of activeUsers.entries()) {
            if (sId === socket.id) {
                activeUsers.delete(userId);
                io.emit('activeUsers', Array.from(activeUsers.keys()));
                break;
            }
        }
    });

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
        /*data should contain:
        {
    room: "roomId",
    sender: "senderId",
    receiver: "receiverId",
    content: "message content"
}
        */
        io.to(`u_${data.receiver}`).emit("receive_message", data);
        io.to(data.room).emit("receive_message", data);
        await messages.create(data);
        await room.findByIdAndUpdate(data.room, { $addToSet: { unreadBy: data.receiver } });

    });


});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

export default server;
