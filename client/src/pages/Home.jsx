import React from 'react'
import {Box, Container, Text}  from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'

function Home() {
  return (
    <Container maxW={'xl'} centerContent>
      <Box
       display='flex'
       justifyContent={'center'}
       padding={"10px 70px"}
       bg={'white'}
       margin={"40px 0 15px 0"}
       borderRadius={'lg'}
       borderWidth={'1px'}
      
      >
        <Text fontSize={'4xl'} fontFamily={'Work sans'} color={'black'}>LetsChat</Text>
      </Box>
      <Box bg={"white"} w={"100%"} p={4} borderRadius={'lg'} borderWidth={'1px'} color={"black"}>
      <Tabs variant='soft-rounded' >
        <TabList>
          <Tab w={'50%'}>Login</Tab>
          <Tab w={'50%'}>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login/>
          </TabPanel>
          <TabPanel>
            <Signup/>
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
    </Container>
  )
}

export default Home