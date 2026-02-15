import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { connectDb } from './db/db.js';
import authRouter from './routes/auth.js';
import itemRouter from './routes/item.js';
import mailRouter from './routes/mail.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', itemRouter);
app.use('/mail/', mailRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

connectDb();

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on("send_message", (data) => {
        console.log("Message received: ", data);
        io.to(data.room).emit("receive_message", data);
    });


});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

export default server;
