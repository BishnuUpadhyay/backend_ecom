const User = require('../models/usermodel')
const errorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require('../middleware/catchsyncerror')
const sendToken = require('../utils/jwttoken')
const ErrorHander = require('../utils/errorhandler')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')




//Register user

const registerUser = catchAsyncErrors(async (req, res, next) => {

  const { name, email, password } = req.body
  const user = await User.create({
    name, email, password,
    avatar: {
      public_id: "This is the sample id",
      url: "Profilepic"
    }
  })
  sendToken(user, 201, res)
})


// login user

const loginUser = catchAsyncErrors(async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("please Enter Email and Password both", 400))

  }
  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    return next(new errorHandler('Invalid email or Password', 401))
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new errorHandler('Invalid email or Password', 401))
  }
  sendToken(user, 200, res)


})

//LogOut User

const logOut = catchAsyncErrors(async (req, res, next) => {

  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
})
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ErrorHander("User not Found", 404))
  }
  //Get resetPassword token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${req.protocol}://${req.get("host")}/password/${resetToken}`

  const message = ` Your password reset token :- \n\n ${resetPasswordURL} \n \n If you have not requested this email than, Please ignore it`

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,

    })
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`
    })

  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500))
  }
})



//resetPassword
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
  if (!user) {
    return next(new ErrorHander("Reset password token is invalid or has been  expired", 404))
  }
  if (req.body.password !== req.body.confiremedPassword) {
    return next(new ErrorHander("password does not match", 404))
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save()
  sendToken(user,200,res)

})
//Get User Detail

const getUserDetail = catchAsyncErrors(async(req,res,next)=>{
const user = await User.findById(req.user.id)
res.status(200).json({
  success:true,
  user
})
})

//Change user password 
const updatePassword = catchAsyncErrors( async(req,res,next)=>{
  const user =await User.findById(req.user.id).select("+password")
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
  if(!isPasswordMatched){
    return next(new ErrorHander("Old password is incorrect",400))
  }
  if(req.body.newpassword !==req.body.confiremedPassword){
    return next(new ErrorHander("password does not matched",400))


  }
  user.password = req.body.newpassword;
  await user.save()
  sendToken(user,200,res)
})


//Change user Profile 
const updateProfile = catchAsyncErrors( async(req,res,next)=>{

 const newUserData ={
  name : req.body.name,
  email : req.body.email,
 }
 const user =await User.findByIdAndUpdate(req.user.id, newUserData,{
  new :true,
  runValidators:true,
  useFindAndModify:false
 })
 res.status(200).json({
  success:true
 })
})


//Get all User(admin)

const getAllUser = catchAsyncErrors( async (req,res,next)=>{
  const user = await User.find();

  res.status(200).json({
    success:true,
    user
  })
})
//Get single User Detail (admin)

const getSingleUser = catchAsyncErrors( async (req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHander(`User does not exit with id ${req.params.is}`,400))
  }

  res.status(200).json({
    success:true,
    user
  })
})

//Change users ROle --admin

const changeRole = catchAsyncErrors(async (req,res,next)=>{
  const newUserData ={
    name : req.body.name,
    email : req.body.email,
    role : req.body.role
  }
 const  user =await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });
  if(!user){
    return(new ErrorHander(`user does not exit with this id ${req.params.id}`,400))
  }
  res.status(200).json({
    success:true,
  })
})

//Delete User --admin

const deleteUser = catchAsyncErrors(async (req,res,next)=>{
const user = await User.findById(req.params.id)
if(!user){
  return(new ErrorHander(`user does not exit with this id ${req.params.id}`,400))
}
await user.remove()
res.status(200).json({
  success:true,
  message :"user Deleted successfully"
})
})

module.exports = { registerUser,
                   loginUser, logOut, forgotPassword,
                   resetPassword,getUserDetail,
                   updatePassword,updateProfile,
                   getAllUser,getSingleUser,
                   changeRole,deleteUser };