const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({

    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: Number, required: true },
        phoneNo: { type: Number, required: true },
    },
    orderItem: [
        {
            name: { type: Number, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: Number, required: true },
            product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
            user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
            paymentInfo: {
                id: { type: Number, required: true },
                status: { type: Number, required: true },
            },
            paidAt: {
                type: Date,
                required: true
            },
            itemPrice: {
                type: Number,
                default: 0,
                required: true,
            },
            taxPrice: {
                type: Number,
                required: true,
                default: 0
            },
            shippingPrice: {
                type: Number,
                required: true,
                default: 0
            },
            totalPrice: {
                type: Number,
                required: true,
                default: 0
            },
            orderStatus: {
                type: String,
                required: true,
                default: "Processing"
            },
            deliverAt:Date,
            createdAt:{
                type:Date,
                default:Date.now,
            }
        }
    ]
})

const orderModel = mongoose.model("Order",orderSchema);
module.exports = orderModel;