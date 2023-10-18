import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import ChatPageSocket from "./pages/ChatPageSocket";
import ChatPageWebsocket from "./pages/ChatPageWebSocket";
import socketIO from "socket.io-client"

// const socket = socketIO.connect("http://localhost:4000");
const socket = new WebSocket("ws://localhost:8080");
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/chat/:username" element={<ChatPageSocket socket={socket} />} /> */}
        <Route path="/chat/:username" element={<ChatPageWebsocket socket={socket} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;