const catchAsyncErrors = require('../middleware/catchsyncerror');
const errorhandler = require('./error');
const jwt = require('jsonwebtoken')
const User = require('../models/usermodel')

const isAuthenticatedUser = catchAsyncErrors( async (req,res,next)=>{
    const {token }= req.cookies;
 
    if(!token){
        return next(new errorhandler("please login to access this resourcde",401));
    }
const decodedDate = jwt.verify(token,process.env.JWT_SECRET);
req.user =await User.findById(decodedDate.id)
next()
})
module.exports = isAuthenticatedUser