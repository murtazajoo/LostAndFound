import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const itemSchema = new Schema({
    type: { type: String, enum: ['found', 'lost'], required: true },
    itemName: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    date: { type: Date },
    imageUrl: { type: String },
    whatsAppNumber: { type: String },
    userId: { type: Types.ObjectId, ref: 'User' },
    email: { type: String },
    claimed: { type: Boolean, default: false },
    claimedBy: { type: Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now }
});

export default model('Item', itemSchema);
