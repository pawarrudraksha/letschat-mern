import express from "express";
import { chats } from "./data/data.js";
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js";
import userRoutes from './routes/user.route.js'
dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000

connectDB()
app.use(express.json())
app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`);
})

app.use('/api/user',userRoutes)
app.get('/api/chat',(req,res)=>{
    res.json(chats)
})
app.get('/api/chat/:id',(req,res)=>{
    const chat=chats.find((chat)=>chat._id===req.params.id)
    res.json(chat)
})