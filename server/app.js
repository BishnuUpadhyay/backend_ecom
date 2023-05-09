const express = require('express')
const app= express ()
const cors = require('cors')
const productRouter =require('./routes/Productroute')
const errorMiddleware = require('./middleware/error')
const userRouter = require('./routes/userRoute')
const orderRouter = require('./routes/orderroute')
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/api/v1',productRouter)
app.use("/api/v1",userRouter)
app.use("/api/v1",orderRouter)


//middleware for error
app.use(errorMiddleware)


module.exports =app