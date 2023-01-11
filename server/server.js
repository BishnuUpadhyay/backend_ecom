const app= require('./app')
 const dotenv =require('dotenv')
 dotenv.config()

const connectDatabase= require('./database/database')
PORT =process.env.PORT

// handleing uncaught Exception 
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Server is down due to uncaught Exception` )
    process.exit(1)
})

// console.log(hello)

connectDatabase()
 const server = app.listen(PORT,()=>console.log(`Server is listening on PORT ${PORT}`))

// unhandled Promise Rejection

process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`Shutting down the server due to unhandled promise Rejection : ${data.connection.host}`)
    server.close(()=>{
        process.exit(1)
    })
})
