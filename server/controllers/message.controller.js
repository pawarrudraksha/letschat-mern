import { Chat } from "../models/chat.model.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/user.model.js";

export const sendMessage=async(req,res)=>{
    try {
        const {content,chatId}=req.body
        if(!content || !chatId){
            console.log("Invalid data passed");
            res.status(400)        
        }
        let newMessage={
            sender:req.user._id,
            content:content,
            chat:chatId
        }
        let message=await Message.create(newMessage)
        message=await message.populate("sender","name pic")
        message=await message.populate("chat")
        message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.status(200).json(message)
    } catch (error) {
        res.status(400).json(error.message)
    }
}
export const allMessages=async(req,res)=>{
    try {
        
        const messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
        res.status(200).json(messages)
    } catch (error) {
        res.status(400).json(error.message)
    }
}