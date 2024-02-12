import mongoose from "mongoose";

const messageSchema=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
    }
})

export const Message=mongoose.model("Message",messageSchema)