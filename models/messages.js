import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messagesSchema = new Schema({
    content: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default model('Message', messagesSchema);