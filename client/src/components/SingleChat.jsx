import "./styles.css"
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogic'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'

function SingleChat() {
    const toast=useToast()
    const {user,selectedChat,setSelectedChat}=ChatState()
    const [loading,setLoading]=useState(false)
    const [messages,setMessages]=useState([])
    const [newMessage,setNewMessage]=useState();
    
    const fetchMessages=async()=>{
        if(!selectedChat) return;
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`/api/message/${selectedChat._id}`,config)
            setMessages(data)
            setLoading(false)
        } catch (error) {
            toast({
                title:"Error occurred",
                description:`${error}`,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
              }) 
        }
    }
    useEffect(()=>{
        fetchMessages()
    },[selectedChat])
    const sendMessage=async(event)=>{
        if(event.key==="Enter" && newMessage){
            try {
                const config={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
                const {data}=await axios.post("/api/message",{
                    content:newMessage,
                    chatId:selectedChat._id
                },config)
                setNewMessage("")
                setMessages([...messages,data])
            } catch (error) {
                toast({
                    title:"Error occurred",
                    description:`${error}`,
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom"
                  })  
            }
        }
    }
    const typingHandler=(e)=>{
        setNewMessage(e.target.value)
    }
    return (
        <>
        {
            selectedChat?
            <>
                <Text
                    fontSize={{base:"28px",md:"30px"}}
                    pb={3}
                    px={2}
                    w={"100%"}
                    fontFamily={"Work sans"}
                    display={"flex"}
                    justifyContent={{base:"space-between"}}
                    alignItems={"center"}
                >
                    <IconButton
                        display={{base:"flex",md:"none"}}
                        icon={<ArrowBackIcon/>}
                        onClick={()=>setSelectedChat("")}
                    />
                    {!selectedChat?.isGroupChat ?(
                        <>
                        {getSender(user,selectedChat.users)}
                        <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                        </>
                    ):(
                        <>
                        {selectedChat?.chatName.toUpperCase()}
                        {
                            <UpdateGroupChatModal
                               fetchMessages={fetchMessages}
                            />
                        }
                        </>
                    )}
                </Text>
                <Box
                    display={"flex"}
                    flexDir="column"
                    justifyContent={"flex-end"}
                    p={2}
                    bg={"#E8E8E8"}
                    w={"100%"}
                    h={"100%"}
                    borderRadius={"lg"}
                    overflowY={"hidden"}
                >
                    { loading? (
                            <Spinner
                                size={"xl"}
                                w={20}
                                h={20}
                                alignSelf={"center"}
                                margin={"auto"}
                            />
                        ):(
                        <div className='messages'>
                            <ScrollableChat messages={messages}/>
                        </div>
                        )
                    }
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input variant={"filled"} bg={"#E0E0E0"} placeholder='Enter a message' onChange={typingHandler} value={newMessage}/>
                    </FormControl>
                </Box>
            </>:(
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"} >
                    <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
        }
        </>
    )
}

export default SingleChat