import mongoose from "mongoose";
import app from "./app"
import config from "./config/index";

( async ()=>{
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("db connected")

        app.on("error",(err)=>{
            console.log("Error",err)
            throw err
        })

        const listening = ()=>{
            console.log(`server is runing at port ${config.PORT}`)
        }

        app.listen(config.PORT,listening)
        
    } catch (error) {
        console.log("error",error)
        throw error
    }
}) ()