import { generateToken } from "../config/generateToken.js";
import { User } from "../models/user.model.js";

export const registerUser=async(req,res)=>{
    try {
        
        const {name,email,password,pic}=req.body
        if(!name || !email || !password){
        res.status(400).json("Please enter all fields")  
    }
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400).json("User already exists")  

    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400).json("Failed to create a new User")  
    }
    } catch (error) {
        res.status(400).json(error.message)  
    }
}
export const authUser=async(req,res)=>{
    try {
        
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(user && (await user.matchPassword(password))){
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
            })
        }else{
            res.status(400).json("Failed to login")  

        }
    } catch (error) {
        res.status(400).json(error.message)  
    }
}

export const allUsers=async(req,res)=>{
    try {
        const keyword=req.query.search?{
            $or:[
                {name:{$regex:req.query.search,$options:"i"}},
                {email:{$regex:req.query.search,$options:"i"}}
            ]
        }:{}

        const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json(error.message)    
    }
}