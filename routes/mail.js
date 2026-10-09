import express from 'express';
import OTP from '../models/otp.js';

const Router = express.Router();

Router.post('/otp/send', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        await OTP.findOneAndUpdate(
            { email },
            { email, otp: '000000', verified: true, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ message: `OTP sent to ${email}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

Router.post('/otp/verify', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        await OTP.findOneAndUpdate(
            { email },
            { email, otp: '000000', verified: true, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
});

export default Router;
