
const ErrorHander = require('../utils/errorhandler')

const errorhandler = (err,req,res,next)=>{
    err.statusCode =err.statusCode || 500;
    err.message =err.message ||"Internal Server Error"

//Wrong MOngodb Id Error
if(err.name ==="CastError"){
    const message =`Resource not found. Invalid ${err.path}`
    err = new ErrorHander(message,400)
}


    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

//mongoose duplicate key error
if(err.code ===11000){
    const message =`Duplicate ${object.keys(err.keyvalue)} Entered`
    err = new ErrorHander(message,400)
}
//wrong jwt error
if(err.code ==='JsonWebTokenError'){
    const message =`Json web token is invalid try again`
    err = new ErrorHander(message,400)
}
//Jwt expire Error
if(err.code ==='TokenExpiredError'){
    const message =`Json web token is Expired try again`
    err = new ErrorHander(message,400)
}
}
module.exports =errorhandler