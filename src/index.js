import dotenv from 'dotenv'
import mongoose from "mongoose";

import connectDB from "./db/index.js";
import { app } from './App.js';


dotenv.config({
    path:'./.env'

})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is runing at port : ${process.env.PORT}`);
    })

})
.catch((err)=>{
    console.log("Mongo db connection failed",err)
})




// import express from 'express'
// const app = express()
// (async()=>{
//     try {
//          await mongoose.connect(`${process.env.MONGOOSE}${DB_NAME}`)
//          app.on("error",(error)=>{
//             console.log("error",error);
//             throw error;
//          })
//          app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//          })
        
//     } catch (error) {
//         console.error("ERROR",error)
//         throw error
        
//     }
// })()