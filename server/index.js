import express from "express";
import { chats } from "./data/data.js";
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js";
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.routes.js'
import messageRoutes from './routes/message.routes.js'
import { Server } from "socket.io";

dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000

connectDB()
app.use(express.json())
const server=app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`);
})
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "localhost:3000"
    }
});

io.on("connection",(socket)=>{
    // Create a new room by taking userdata from frontend
    socket.on('setup',(userData)=>{
        socket.join(userData._id) // room created
        socket.emit("connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User joined room",room);
    })
    socket.on("typing",(room)=>{
        socket.in(room).emit("typing")
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing")
    })
    socket.on("new message",(newMsgReceived)=>{
        var chat=newMsgReceived.chat
        if(!chat.users) return  console.log("chat.users not defined");
        chat.users.forEach(user=>{
            if(user._id===newMsgReceived.sender._id) return;
            socket.in(user._id).emit("message received",newMsgReceived)
        })
    })
    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id)
    })

})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
