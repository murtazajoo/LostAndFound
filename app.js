import cookieParser from 'cookie-parser';
import cors from "cors";
import express from 'express';
import jwt from 'jsonwebtoken';
import connectDb from './db/db.js';
import authRouter from './routes/auth.js';
import ItemRouter from './routes/item.js';


const app = express()
const port = 3000


app.use(cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001", "https://lost-and-found-asc.vercel.app/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.use(authRouter);
app.use(ItemRouter);



app.get('/user', async (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decodedToken = jwt.verify(token, 'tjisismysceerrtetkey');
    if (!decodedToken) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(decodedToken.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });


    res.json({ message: 'User route', user })
})

connectDb();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
