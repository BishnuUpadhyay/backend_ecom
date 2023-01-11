const async = require('hbs/lib/async')
const Product = require('../models/productModel')
const errorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchsyncerror')
const ApiFeatures = require('../utils/apifeatures')


// create Product   --Admin
const createProduct=catchAsyncErrors(
  async (req,res,next)=>{
    const product = await Product.create(req.body)
    res.status(201).json({
      success:true,
      product
    })
  }
)


// get all Ptoduct
const getAllProduct = catchAsyncErrors(
  async(req,res)=>{

    const resultPerPage =5;
    const productCount = await Product.countDocuments();
   const apiFeature =new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const products= await apiFeature.query
     res.status(200).json({
       success:true,
       products
     })
   }
) 


// get product detail

const getProductDetail = catchAsyncErrors(
  async (req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
      return  next(new errorHandler("Product Not found",404))
  
    }
    res.status(200).json({
      success:true,
      product,
      productCount
    })
  }
  
) 

//Update Product --admin
const updateProduct =catchAsyncErrors(
  async (req,res,next)=>{
    let product = Product.findById(req.params.id);
    if(!product){
      return  res.status(500).json({
        success:false,
        message:"Product not found"
      })
    
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true,useFindAndModify:false});
    res.status(200).json({
      success:true,
      product
    })
    }
)

//delete Product --admin
const  deleteProduct = catchAsyncErrors(
  async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
      return res.status(404).json({
        success:false,
        message:"Not found"
      })
    }
   await product.remove()
   res.status(200).json({
    success:true,
    message:"product delete successfully"
   })
  }
) 

module.exports ={ getAllProduct,createProduct,updateProduct ,deleteProduct ,getProductDetail}