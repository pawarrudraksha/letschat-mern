import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogic';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';


function SideDrawer() {
  const toast=useToast()
  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState()
  const {isOpen,onOpen,onClose}=useDisclosure()
  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false)
  const [loadingChat,setLoadingChat]=useState()
  const navigate=useNavigate()
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo")
    navigate("/")
  }
  const accessChat=async(userId)=>{
    try {
      setLoadingChat(true)
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data}=await axios.post('/api/chat',{userId},config)
      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
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
  const handleSearch=async()=>{
    if(!search){
      toast({
        title:"Please enter something in search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left"
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
      const {data}=await axios.get(`/api/user?search=${search}`,config)
      setLoading(false)
      setSearchResult(data)
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
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement='bottom-end' >
          <Button variant={"ghost"} onClick={onOpen} > 
            <IoIosSearch />
            <Text d={{base:"none",md:"flex"}} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Lets Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification && notification?.map((item)=>(
                <MenuItem key={item._id} onClick={()=>{
                  setSelectedChat(item.chat)
                  setNotification(notification.filter((notif)=>notif!==item))
                }}>
                  {item.chat.isGroupChat?`New Message ${item.chat.isGroupChat}`:`New message from ${getSender(user,item.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>

          </Menu>
          <Menu>
            <MenuButton as={Button}  rightIcon={<ChevronDownIcon/>}>
              <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
        <DrawerBody>
          <Box
            display={"flex"}
            pb={2}
          >
            <Input
              placeholder='Search by name or email'
              mr={2}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>
              Go
            </Button>
          </Box>
          {
            loading ?
            <ChatLoading/>:(
              searchResult?.map(user=>(
                <UserListItem
                  key={user?._id}
                  user={user}
                  handleFunction={()=>accessChat(user?._id)}
                />
              ))
            )
          }
          {loadingChat && <Spinner ml={"auto"} display={"flex"}/>}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer