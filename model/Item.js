import mongoose from 'mongoose';

const Item = mongoose.model('Lost', {
    type: {
        type: String,
        default: 'lost'
    },
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    whatsAppNumber: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
    },
    claimed: {
        type: Boolean,
        default: false
    }
});


export default Item;