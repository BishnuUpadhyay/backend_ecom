const catchAsyncErrors = require('../middleware/catchsyncerror');
const ErrorHander = require('../utils/errorhandler')
const jwt = require('jsonwebtoken')
const User = require('../models/usermodel');

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHander("please login to access this resourcde", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id)
    next()
})
const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
      return next(     new ErrorHander
                (`Role:${req.user.role} is not allow to access this role`,403)
                )  
        }
    
        next();
    }
}
module.exports = { isAuthenticatedUser,authorizedRoles}


