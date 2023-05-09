const Order= require("../models/order")
const ErrorHander = require('../utils/errorhandler')
const catchAsyncErrors = require("../middleware/catchsyncerror")
const Product = require("../models/productModel")
const async = require("hbs/lib/async")



// create New Order 
const newOrder =catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,ItemPrice,taxPrice, shippingPrice,totalPrice}=req.body;
    const order = await Order.create({
        shippingInfo,orderItems,
        paymentInfo,itemPrice,taxPrice,
        shippingPrice, totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });
    res.status(201).json({
        success:true,
        order
    })
})

//get single order 

const getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order =await Order.findById(req.param.id).populate("user","name email");
    if(!order){
        return(next(new ErrorHander("Order not found with this id",404)))
    }
    res.status(200).json({
        success:true,
        order
    })
})

//get logged in users order
const myOrders =catchAsyncErrors(async (req,res,next)=>{
    const orders =await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    })
})


// get all orders -- admin 
const getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmount =0
    orders.forEach(order=>{
        totalAmount+= order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,totalAmount
    })
})
//update order status --admin

const updateOrder =catchAsyncErrors(async(req,res,next)=>{
    const order =await Order.findById(req,params.id)
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHander("You have already delivered this orderd",404))
    }
 order.orderItems.forEach(async order1=>{
   await  updateStock(order1.Product,order1.quantity)
 })
 order.orderStatus= req.body.status;
 if(req.body.status ==="Deliveres"){

    order.deliveredAt = Date.now();

 }
await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })
})

async function updateStock (id,quantity){
    const product = await Product.findById(id);
    product.Stock-=quantity
 await   product.save({validateBeforeSave:false})
}

const DeleteOrder =catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.find(req.params.id)
   await order.remove()

   if(!order){
    return next(new ErrorHander("Order not found with this id"),404)
   }
   res.status(200).json({
    success:true
   })
})

module.exports ={newOrder,getSingleOrder,myOrders,getAllOrders, updateOrder,DeleteOrder}