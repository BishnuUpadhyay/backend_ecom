const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [30, "Name cannot exceed 30 character"],
        minLength: [4, "Name should have more than 4  character"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        unique: true,
        validate: [validator.isEmail, "please Enter valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minLength: [8, "password must bo atleast 8 character"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password =await bcrypt.hash(this.password,10)
})


// jwt token

userSchema.methods.getJWTToken = function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn :process.env.JWT_EXPIRE,
})
}


//compare Password

userSchema.methods.comparePassword =  async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
// Generating Password reset token

userSchema.methods.getResetPasswordToken = async function(){

    //Generating token

const resetToken =crypto.randomBytes(20).toString('hex')

//Hashing and adding resetPasswordtoken to userSchema
 this.resetPasswordToken = crypto
 .createHash('sha256')
 .update(token)
 .digest('hex');
 this.resetPasswordExpire = Date.now() +15*60*1000
 return resetToken
}


const userModel = mongoose.model('user',userSchema)
module.exports = userModel
