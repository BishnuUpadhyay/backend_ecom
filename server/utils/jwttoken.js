//creating token and saving it on cookies

const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken();

    //options for cookie

    const option ={
        httpOnly:true,
        expire:new Date(Date.now + process.env.COOKIE_EXPIRE*24*60*60*100)
    }
    res.status(statusCode).cookie('token',token,option).json({
        success:true,
        user,
        token
    })
}
module.exports= sendToken