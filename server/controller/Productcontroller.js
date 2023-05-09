const async = require('hbs/lib/async')
const Product = require('../models/productModel')
const errorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchsyncerror')
const ApiFeatures = require('../utils/apifeatures')
const ErrorHander = require('../utils/errorhandler')


// create Product   --Admin
const createProduct=catchAsyncErrors(async (req,res,next)=>{

    req.body.user = req.user.id

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

    const resultPerPage =8;
    const productCount = await Product.countDocuments();
   const apiFeature =new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const products= await apiFeature.query
     res.status(200).json({
       success:true,
       products, 
       productCount
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

//create new review and update reviews
const createProductReview =catchAsyncErrors(async (req,res,next)=>{
  const {rating, comment, productId} =req.body;
  const review ={
    user : req.body._id,
    name : req.body.name,
    rating : Number(rating),
    comment,
  }
  const product =await Product.findById(productId)
  const isReviewed = product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString())
  if(isReviewed){
product.reviews.forEach(rev=>{
  if(rev.user.toString()==req.user.toString())
  {rev.rating=rating,
  rev.comment=comment}
})
  }
  else{
product.reviews.push(review)
product.numOfReviews =product.reviews.length

  }
  let avg=0
  product.reviews.forEach(rev=>{
    avg+=rev.rating
  })
  product.ratings =avg/product.reviews.length
  await product.save({validateBeforeSave:false})

  res.status(200).json({
    success:true,
  })
})

//Get all reviews of a single product

const getAllReviews = catchAsyncErrors(async (req,res,next)=>{
  const product = await product.findById(req.query.id)
  if(!product){
    return (new ErrorHander("Product not found",404))
  }
  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })
})

//Delete Review

const deleteReview = catchAsyncErrors(async (req,res,next)=>{
  const product = await product.findById(req.query.productId)
  if(!product){
    return (new ErrorHander("Product not found",404))
  }
const reviews =product.reviews.filter(rev=>rev._id.toString() !== res.query.id.toString())

let avg=0
reviews.forEach(rev=>{
  avg+=rev.rating
})
const ratings =avg/reviews.length

const numOfReviews = reviews.length;
await product.findByIdAndUpdate(req.query.productId,{
  reviews,
  ratings,
  numOfReviews,
},{
  new:true,
  runValidators:true,
  useFindAndModify:false
})


  res.status(200).json({
    success:true,
  })
})

module.exports ={ getAllProduct,createProduct,
                 updateProduct ,deleteProduct,
                 getProductDetail,createProductReview,
                 getAllReviews,deleteReview
}