import express from 'express';
import { Resend } from 'resend';
import OTP from '../models/otp.js';

const Router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);


Router.post('/otp/send', async (req, res) => {
    const { email } = req.body;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const message = {
        from: process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "Your OTP Code for Findrr",
        text: `Your OTP is: ${generatedOtp}`,
        html: `<p>Your OTP is: <b>${generatedOtp}</b>
        <br/> Findrr
        </p>`,
    };
    try {
        await resend.emails.send(message);
        await OTP.create({ email, otp: generatedOtp });
        res.status(200).json({ message: `OTP sent to ${email}` });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to send OTP" });

    }

});
Router.post('/otp/verify', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const record = await OTP.findOne({ email, otp });
        if (!record) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        await OTP.updateOne({ email }, { verified: true });
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to verify OTP" });
    }
});




export default Router;
