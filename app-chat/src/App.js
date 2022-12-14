import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import io from 'socket.io-client';
// import { Navigate } from "react-router-dom";
import { Login } from "./components/login";
import { Chat } from "./components/chat";
import Peer from "peerjs";
const AppContext = React.createContext();

const socket = io.connect('http://localhost:3001/');

function App() {
  return (
    <AppContext.Provider value={{ socket }}>
      <div id="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
export default App;