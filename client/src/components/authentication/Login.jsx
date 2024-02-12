import React, { useState } from 'react'
import {VStack} from "@chakra-ui/layout"
import {FormControl, FormLabel} from "@chakra-ui/form-control"
import {Input,InputGroup,InputRightElement} from "@chakra-ui/input"
import {Button, useToast} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate=useNavigate()
  const [email,setEmail]=useState('')  
  const [password,setPassword]=useState('')  
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)
  const toast=useToast() 
  const submitHandler=async()=>{
    if( !email || !password ){
        toast({
            title:"Please fill all fields",
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
        const {data}=await axios.post("/api/user/login",{
            email,password
        },config);
        toast({
            title:"Login successful",
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
          <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
              <Input placeholder='Enter your Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </FormControl>
          <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup >
              <Input placeholder='Enter your password'value={password} onChange={(e)=>setPassword(e.target.value)} type={show?"text":"password"}/>
              <InputRightElement width={'4.5rem'}>
                  <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)}>
                      {show ? "Hide":"Show"}
                  </Button>
              </InputRightElement>
              </InputGroup>
          </FormControl>
          <Button colorScheme='blue' width={"100%"} style={{marginTop:15}} onClick={submitHandler}>
              Login in
          </Button>
          <Button
            variant={"solid"}
            colorScheme='red'
            width={"100%"}
            onClick={()=>{
                setEmail('guest@example.com')
                setPassword('123456')
            }}
            isLoading={loading}
          >
            Get Guest user credentials
          </Button>
      </VStack>
  )
}

export default Login