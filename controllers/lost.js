import Item from '../model/Item.js';

export const ItemController = async (req, res) => {
    const type = req.body.type;
    const itemName = req.body.itemName;
    const description = req.body.description;
    const location = req.body.location;
    const date = req.body.date;
    const imageUrl = req.body.imageUrl;
    const whatsAppNumber = req.body.whatsAppNumber;
    const email = req.body.email;

    console.log(req.body)
    if (!itemName || !description || !location || !date || !imageUrl || !whatsAppNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const item = await Item.create({
            type,
            itemName,
            description,
            location,
            date,
            imageUrl,
            whatsAppNumber,
            userId: req.userId,
            email
        });

        res.status(201).json({ message: 'Lost item reported successfully', item });

    } catch (error) {
        res.status(500).json({ message: 'Error reporting lost item', error: error.message });
    }
}




export const LostItemsController = async (req, res) => {
    try {
        const items = await Item.find({ type: 'lost', }).sort({ date: -1 });
        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lost items', error: error.message });
    }
};

export const FoundItemsController = async (req, res) => {
    try {
        const items = await Item.find({ type: 'found' });
        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching found items', error: error.message });
    }
};

export const getSingleItemController = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ item });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error: error.message });
    }
};


export const deleteItemController = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        if (item.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own items' });
        }
        await Item.findByIdAndDelete(id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
};


export const markItemAsClaimedController = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.claimed = true;
        await item.save();
        res.status(200).json({ message: 'Item marked as found', item });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error: error.message });
    }
}