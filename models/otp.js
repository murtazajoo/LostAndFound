import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const otpSchema = new Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default model('Otp', otpSchema);