import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import UserListItem from '../UserAvatar/UserListItem'
import axios from 'axios'
import UserBadge from '../UserAvatar/UserBadge'

function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState("")
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const toast=useToast()
    const {user,chats,setChats}=ChatState()

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
    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User already added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            }) 
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd])
    }
    const handleDelete=(user)=>{
        const filteredUsers=selectedUsers?.filter((prev)=>prev._id!==user._id)
        setSelectedUsers(filteredUsers)
    }
    const handleSubmit=async()=>{
        if(!groupChatName || !selectedUsers){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            }) 
            return;
        }
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.post("/api/chat/group",{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id))
            },config)
            setChats([data,...chats])
            onClose()
            toast({
                title:"Group created successfully",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"top"
            }) 
        } catch (error) {
            
        }
    }

    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
                fontSize={"35px"}
                fontFamily={"Work sans"}
                display={"flex"}
                justifyContent={"center"}
            >Create Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}

            >
                <FormControl>
                    <Input 
                        placeholder='Chat Name'
                        mb={3}
                        onChange={(e)=>setGroupChatName(e.target.value)}
                    />
                </FormControl>   
                <FormControl>
                    <Input 
                        placeholder='Add users'
                        mb={1}
                        onChange={(e)=>handleSearch(e.target.value)}
                    />
                </FormControl>   
                <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
                {
                    selectedUsers?.map((user)=>(
                        <UserBadge key={user._id} user={user} handleFunction={()=>handleDelete(user )}/>
                        ))
                }
                </Box>
                {
                    loading?<div>loading</div>:(
                        searchResult?.slice(0,4).map((user)=>(
                            <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                        ))
                    )
                }
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </>
    )
}

export default GroupChatModal