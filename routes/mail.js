import express from 'express';
import nodemailer from 'nodemailer';
import OTP from '../models/otp.js';

const Router = express.Router();






Router.post('/otp/send', async (req, res) => {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const message = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your OTP Code for Findrr",
        text: `Your OTP is: ${generatedOtp}`,
        html: `<p>Your OTP is: <b>${generatedOtp}</b>
        <br/> Findrr
        </p>`,
    };
    try {
        await OTP.create({ email, otp: generatedOtp });
        await transporter.sendMail(message);
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