import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const roomSchema = new Schema({
    name: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    unreadBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default model('Room', roomSchema);