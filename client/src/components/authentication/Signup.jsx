import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {VStack} from "@chakra-ui/layout"
import {FormControl, FormLabel} from "@chakra-ui/form-control"
import {Input,InputGroup,InputRightElement} from "@chakra-ui/input"
import {Button, useToast} from "@chakra-ui/react"
import { storage } from '../../pages/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import axios from "axios";

function Signup() {
    const toast=useToast()
    const [name,setName]=useState('')  
    const [email,setEmail]=useState('')  
    const [pic ,setPic]=useState(null)  
    const [password,setPassword]=useState('')  
    const [confirmPassword,setConfirmPassword]=useState('')  
    const [show,setShow]=useState(false)
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const postDetails=(pics)=>{
        setLoading(true)
        if(pics===undefined){
            toast({
                title:"Please select an image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return;
        }
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
            const storageRef = ref(storage, `${name}`);
            const uploadTask = uploadBytesResumable(storageRef, pics || "");
            uploadTask.on('state_changed', 
            (snapshot) => {
            }, 
            (error) => {
                console.log(error);
                setLoading(false)
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setPic(downloadURL)
                setLoading(false)
            }
            );
        })}else{
            toast({
                title:"Please select an image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            setLoading(false)
        }
    }
    const submitHandler=async()=>{
        if(!name || !email || !password || !confirmPassword){
            toast({
                title:"Please fill all fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return;
        }
        if(password!==confirmPassword){
            toast({
                title:"Passwords dont match",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return;
        }
        try {
            const config={
                headers:{
                    "Content-type":"application/json"
                }
            }
            const {data}=await axios.post("/api/user",{
                name,email,password,pic
            },config);
            toast({
                title:"Registration successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            localStorage.setItem("userInfo",JSON.stringify(data))
            setLoading(false)
            navigate("/chats")
        } catch (error) {
            toast({
                title:"Error occurred",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })   
        }
    }   
    return (
        <VStack spacing={'5px'} color={'black'}>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter your name' onChange={(e)=>setName(e.target.value)}/>
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}/>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup >
                <Input placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} type={show?"text":"password"}/>
                <InputRightElement width={'4.5rem'}>
                    <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)}>
                        {show ? "Hide":"Show"}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>confirm password</FormLabel>
                <InputGroup >
                <Input placeholder='confirm password' onChange={(e)=>setConfirmPassword(e.target.value)} type={show?"text":"password"}/>
                <InputRightElement width={'4.5rem'}>
                    <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)}>
                        {show ? "Hide":"Show"}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel></FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e)=>postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button colorScheme='blue' width={"100%"} style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup