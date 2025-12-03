import express from 'express';
import { loginController, registerController } from '../controllers/auth.js';
import isAuthenticated from '../middleware/auth-middeware.js';

const authRouter = express.Router();


authRouter.post('/auth/register', registerController)
authRouter.post('/auth/login', loginController)
authRouter.get('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

authRouter.get("/auth/status", isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'User is authenticated', userId: req.userId });
});




export default authRouter;