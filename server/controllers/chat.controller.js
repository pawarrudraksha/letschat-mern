import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

export const accessChat=async(req,res)=>{
    try {
    const {userId}=req.body;
    if(!userId){
        console.log("UserId param not sent with request");
        return res.status(400)
    }
    let isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("users","-password").populate("latestMessage")
    isChat=await User.populate(isChat,{
        path:'latestMessage.sender',
        select:'name pic email'
    })
    if(isChat.length>0){
        res.status(200).send(isChat[0])
    }else{
        let chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }
        const createdChat=await Chat.create(chatData)
        const fullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password")
        res.status(200).send(fullChat)
    }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export const fetchChats=async(req,res)=>{
    try {
       await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            })
            res.status(200).send(results)
        })
        
    } catch (error) {
        res.status(400).json("error",error.message)
    }
}

export const createGroupChat=async(req,res)=>{
    try {
        
        if(!req.body.users || !req.body.name){
            return res.status(400).send({message:"Please fill all the fields"})
    }
    let users=JSON.parse(req.body.users)
    if(users.length < 2){
        return res.status(400).send("more than two users required to form a group chat")
    }
    users.push(req.user)
    const groupChat=await Chat.create({
        chatName:req.body.name,
        users:users,
        isGroupChat:true,
        groupAdmin:req.user
    })
    const fullGroupChat=await Chat.findOne({
        _id:groupChat._id,
    }).populate("users","-password").populate("groupAdmin","-password")
    res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400).json(error.message)   
    }

}

export const renameGroup=async(req,res)=>{
    try {
        const {chatId,chatName}=req.body
        const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },{
            new:true
        }
        ).populate("users","-password").populate("groupAdmin","-password")
        if(!updatedChat){
            res.status(404).json({msg:"Chat not found"})
        }else{
            res.json(updatedChat)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export const addToGroup=async(req,res)=>{
    try {
        
        const {chatId,userId}=req.body
        const added=await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
        ).populate("users","-password").populate("groupAdmin","-password")
        if(!added){
            res.status(404).json({msg:"Chat not found"})
        }else{
            res.json(added)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
    }

export const removeFromGroup=async(req,res)=>{
    try {
        
        const {chatId,userId}=req.body
        const removed=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },
        {
            new:true
        }
        ).populate("users","-password").populate("groupAdmin","-password")
        if(!removed){
            res.status(404).json({msg:"Chat not found"})
        }else{
            res.json(removed)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
    }