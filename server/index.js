import express from "express";
import { chats } from "./data/data.js";
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js";
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.routes.js'
dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000

connectDB()
app.use(express.json())
app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`);
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
