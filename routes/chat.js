import express from 'express';
import isAuthenticated from '../middleware/auth-middeware.js';
import Item from '../models/Item.js';
import Message from '../models/messages.js';
import Room from '../models/room.js';

const ChatRouter = express.Router();


ChatRouter.get('/chat/rooms', isAuthenticated, async (req, res) => {
    try {
        const rooms = await Room.find({ members: { $in: [req.userId] } }).populate('members', 'name email').populate('itemId', 'itemName imageUrl').sort({ updatedAt: -1 });
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Chat rooms retrieved successfully' });
});


ChatRouter.post('/chat/rooms', isAuthenticated, async (req, res) => {
    const { name, members, itemId } = req.body;
    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required to create a chat room' });
    }
    if (!name || !members || !Array.isArray(members) || members.length === 0 || members.some(member => typeof member !== 'string')) {
        return res.status(400).json({ message: 'Name and members are required' });
    }
    try {
        const existingRoom = await Room.findOne({ itemId, members: { $all: [req.userId, ...members] } }).populate('members', 'name email').populate('itemId', 'itemName imageUrl');
        if (existingRoom) {
            return res.status(200).json({ message: 'Chat room with the same name and members already exists', room: existingRoom });
        }

        if (members.includes(req.userId)) {
            return res.status(400).json({ message: 'You cannot create a chat room with yourself as a member' });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Create the room first
        const createdRoom = await Room.create({ name, members: [...members, req.userId], itemId });

        // Then populate it
        const room = await Room.findById(createdRoom._id).populate('members', 'name email').populate('itemId', 'itemName imageUrl');

        res.status(200).json({ message: 'Chat room created successfully', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



ChatRouter.get('/chat/rooms/:id/messages', isAuthenticated, async (req, res) => {
    try {
        // Get recent 5 messages in the room with receiver and room details
        const messages = await Message.find({ room: req.params.id }).sort({ createdAt: -1 }).limit(100).populate('receiver', 'name email').populate('room', 'name');
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


ChatRouter.put('/chat/rooms/:id/read', isAuthenticated, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return
        }
        if (!room.members.includes(req.userId)) {
            return
        }
        if (room.unreadBy.includes(req.userId)) {
            await Room.findByIdAndUpdate(req.params.id, { $pull: { unreadBy: req.userId } });
        }
        res.status(200).json({ message: 'Room marked as read' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default ChatRouter;