import express from 'express';
import { loginController, registerController } from '../controllers/auth.js';
import { default as auth, default as isAuthenticated } from '../middleware/auth-middeware.js';
import User from '../models/User.js';

const authRouter = express.Router();


authRouter.post('/auth/register', registerController)
authRouter.post('/auth/login', loginController)
authRouter.get('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

authRouter.get("/auth/status", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userObject = user.toObject();
        res.status(200).json({ ...userObject, message: 'User is authenticated', userId: req.userId, });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

authRouter.get("/auth/logout", auth, async (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
});


export default authRouter;