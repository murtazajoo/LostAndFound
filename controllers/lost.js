import express from 'express';
const router = express.Router();

// Item routes will be defined here

import mongoose from 'mongoose';
import Item from '../models/Item.js';

export const ItemController = async (req, res) => {
    try {
        const payload = req.body;
        if (req.userId) payload.userId = req.userId;
        if (payload.date) payload.date = new Date(payload.date);
        const item = await Item.create(payload);
        res.status(201).json({ message: 'Item created', item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const FoundItemsController = async (req, res) => {
    try {
        const items = await Item.find({ type: 'found' }).sort({ createdAt: -1 }).limit(100);
        res.status(200).json({
            items,
            message: 'Items fetched'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const LostItemsController = async (req, res) => {
    try {
        const items = await Item.find({ type: 'lost' }).sort({ createdAt: -1 }).limit(100);
        res.status(200).json(
            {
                items,
                message: 'Items fetched'
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSingleItemController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
        const item = await Item.findById(id).populate('userId', 'name email');
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({
            item,
            message: 'Item fetched'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteItemController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        if (String(item.userId) !== String(req.userId)) return res.status(403).json({ message: 'Forbidden' });
        await item.deleteOne();
        res.status(200).json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const markItemAsClaimedController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        if (item.claimed) return res.status(400).json({ message: 'Already claimed' });
        item.claimed = true;
        item.claimedBy = req.userId;
        await item.save();
        res.status(200).json({ message: 'Marked as claimed', item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};