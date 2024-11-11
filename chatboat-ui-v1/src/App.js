import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Chat from './pages/ChatBot/Chat';
function App() {
  
  return (
    <>

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
  </Routes>

</>
)
}

export default App;
