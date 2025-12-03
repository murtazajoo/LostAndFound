import express from 'express';
import { FoundItemsController, ItemController, LostItemsController, deleteItemController, getSingleItemController, markItemAsClaimedController } from '../controllers/lost.js';
import isAuthenticated from '../middleware/auth-middeware.js';

const ItemRouter = express.Router();


ItemRouter.get('/item/lost', LostItemsController);
ItemRouter.get('/item/found', FoundItemsController);
ItemRouter.get('/item/:id', getSingleItemController);
ItemRouter.post('/item/add', isAuthenticated, ItemController);
ItemRouter.delete('/item/:id', isAuthenticated, deleteItemController);
ItemRouter.put('/item/:id/claimed', isAuthenticated, markItemAsClaimedController);



export default ItemRouter;