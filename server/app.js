const express = require('express')
const app= express ()
const cors = require('cors')
const productRouter =require('./routes/Productroute')
const errorMiddleware = require('./middleware/error')
const userRouter = require('./routes/userRoute')
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/',productRouter)
app.use("/",userRouter)


//middleware for error
app.use(errorMiddleware)


module.exports =app