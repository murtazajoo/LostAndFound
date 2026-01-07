import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDb } from './db/db.js';
import authRouter from './routes/auth.js';
import itemRouter from './routes/item.js';
import mailRouter from './routes/mail.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    // origin:
    //     "https://lost-and-found-asc.vercel.app"
    origin: "http://localhost:3001"
    , credentials: true
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', itemRouter);
app.use('/mail/', mailRouter);


connectDb();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

export default app;
