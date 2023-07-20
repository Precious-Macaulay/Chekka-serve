const asyncHandler = require("express-async-handler");
const DeferPayment = require("../models/deferPayment");

exports.createDeferPayment = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { product, amount, paycode } = req.body;
    
    const deferPayment = new DeferPayment({
        userId: _id,
        product,
        amount,
        paycode,
    });
    
    await deferPayment.save();
    
    res.json({
        success: true,
        message: "Defer payment created successfully",
    });
    }
);

exports.deferPayment = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    
    const deferPayments = await DeferPayment.find({ userId: _id });
    
    if (deferPayments.length === 0) {
        // No defer payment found
        return res.json({
            success: false,
            message: "No defer payment found",
        });
    }
    
    res.json({
        success: true,
        data: deferPayments,
    });
    }

);
