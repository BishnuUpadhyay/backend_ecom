const User = require('../models/usermodel')
const errorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require('../middleware/catchsyncerror')
const sendToken = require('../utils/jwttoken')



//Register user

const registerUser = catchAsyncErrors( async(req,res,next)=>{

  const {name,email,password}=req.body
  const user = await User.create({
    name, email, password,
    avatar:{
        public_id:"This is the sample id",
        url:"Profilepic"
    }
  })
    sendToken(user,201,res)
  })


// login user

const loginUser = catchAsyncErrors(async(req,res,next)=>{

  const {email,password}= req.body;

  if(!email || !password){
    return next(new errorHandler("please Enter Email and Password both",400))

  }
  const user = await User.findOne({email}).select("+password")
  if(!user){
    return next(new errorHandler('Invalid email or Password',401))
  }

  const isPasswordMatched = user.comparePassword(password);

  if(!isPasswordMatched){
    return next(new errorHandler('Invalid email or Password',401))
  }
sendToken(user,200,res)


})

module.exports ={registerUser, loginUser};