import React, { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import io from 'socket.io-client';
// import { Navigate } from "react-router-dom";
import { Login } from "./components/login";
import { Chat } from "./components/chat";
const AppContext = React.createContext();

const socket = io.connect('http://localhost:3001/');

function App() {
  const [peer, setPeer] = useState();

  return (
    <AppContext.Provider value={{ socket, peer, setPeer }}>
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