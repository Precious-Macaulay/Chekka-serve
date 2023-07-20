const mongoose = require("mongoose");

const deferPaymentSchema = new mongoose.Schema({
    userId: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paycode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    date: {
        type: Date,
        default: Date.now
    }    
});

const DeferPayment = mongoose.model("DeferPayment", deferPaymentSchema);

module.exports = DeferPayment;
