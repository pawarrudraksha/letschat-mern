import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import {Button} from "@chakra-ui/react"
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
        <Routes>
        <Route path="/" element={<Home/>}/> 
        <Route path="/chats" element={<ChatPage/>}/> 
        </Routes>
    </div>
  );
}

export default App;
