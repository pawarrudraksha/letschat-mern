import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import UserBadge from '../UserAvatar/UserBadge'
import axios from "axios"
import UserListItem from '../UserAvatar/UserListItem'

function UpdateGroupChatModal() {
  const {user,selectedChat,setSelectedChat,fetchAgain,setFetchAgain}=ChatState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName,setGroupChatName]=useState()
  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false)
  const [renameLoading,setRenameLoading]=useState(false)
  const toast=useToast()
  const handleRemove=async(user1)=>{
    if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
        toast({
            title:"Only admin can remove someone",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        }) 
        return;
    }
    try {
        setLoading(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put('/api/chat/groupRemove',{
            chatId:selectedChat._id,
            userId:user1._id
        },config)
        user1._id===user._id ? setSelectedChat():setSelectedChat(data)
        setFetchAgain(!fetchAgain)
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
        setLoading(false)
    }
  }
  const handleRename=async()=>{
    if(!groupChatName) return;
    try {
        setRenameLoading(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put('/api/chat/rename',{
            chatId:selectedChat._id,
            chatName:groupChatName
        },config)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setRenameLoading(false)
    } catch (error) {
        toast({
            title:"Error",
            description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        })
        setRenameLoading(false)
        setGroupChatName("")
    }
  }
  const handleSearch=async(query)=>{
    setSearch(query)
        if(!query){
            return;
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`/api/user?search=${search}`,config)
            setSearchResult(data)
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
  const handleAddUser=async(user1)=>{
    if(selectedChat?.users.find((u)=>u._id===user1._id)){
        toast({
            title:"User already in the group",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        }) 
        return;
    }
    if(selectedChat.groupAdmin._id!==user._id){
        toast({
            title:"Only admin can add someone",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        }) 
        return;
    }
    try {
        setLoading(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put('/api/chat/groupadd',{
            chatId:selectedChat._id,
            userId:user1._id
        },config)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
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
        setLoading(false)
    }
  }
  return (
    <>
    <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                {selectedChat?.users?.map((user)=>(
                    <UserBadge
                        key={user?._id}
                        user={user}
                        handleFunction={()=>handleRemove(user)}
                    />
                ))}
            </Box>
            <FormControl display={"flex"}>
                <Input placeholder='Chat name' mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
                <Button 
                    variant={"solid"}
                    colorScheme='teal'
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>
            <FormControl >
                <Input placeholder='Add user to group' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
                
            </FormControl>
            {
                loading ? (
                    <Spinner size={"lg"}/>
                ) :(
                    searchResult.map((user)=>(
                        <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={()=>handleAddUser(user)}
                        />
                    ))
                )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal