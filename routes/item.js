import express from 'express';
import { FoundItemsController, ItemController, LostItemsController, deleteItemController, getSingleItemController, markItemAsClaimedController } from '../controllers/lost.js';
import isAuthenticated from '../middleware/auth-middeware.js';
import Item from '../models/Item.js';

const ItemRouter = express.Router();

ItemRouter.get('/item/my', isAuthenticated, async (req, res) => {
    try {
        const items = await Item.find({ userId: req.userId })
        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ItemRouter.get('/item/lost', LostItemsController);
ItemRouter.get('/item/found', FoundItemsController);
ItemRouter.get('/item/:id', getSingleItemController);
ItemRouter.post('/item/add', isAuthenticated, ItemController);
ItemRouter.delete('/item/:id', isAuthenticated, deleteItemController);
ItemRouter.put('/item/:id/claimed', isAuthenticated, markItemAsClaimedController);




export default ItemRouter;