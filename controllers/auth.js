import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/otp.js';

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const isVerifiedEmail = await OTP.findOne({ email, verified: true });
        if (!isVerifiedEmail) return res.status(400).json({ message: 'Email not verified' });

        const user = await User.create({ name, email, password: hashed });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
        res.cookie('token', token, {
            sameSite: 'none', secure: true, path: '/', httpOnly: true, maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ message: 'User created', userId: user._id, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).json({ message: 'Logged in', userId: user._id, token, ...user.toObject(), password: undefined });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
