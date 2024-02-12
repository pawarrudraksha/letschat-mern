import express from "express";
import { chats } from "./data/data.js";
import dotenv from 'dotenv'
dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`);
})

app.get('/',(req,res)=>{
    res.send("cool")
})
app.get('/api/chat',(req,res)=>{
    res.json(chats)
})
app.get('/api/chat/:id',(req,res)=>{
    const chat=chats.find((chat)=>chat._id===req.params.id)
    res.json(chat)
})