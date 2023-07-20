const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32
    },
    cost_type: {
        type: String,
        enum: ['fixed', 'variable'],
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
