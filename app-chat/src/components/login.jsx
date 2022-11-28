import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import { Peer } from "peerjs";
import "../styles/login.css";
import { Signup } from "./signUp";

export function Login() {

  const [signUpModal, setSignUpModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const socket = useAppContext().socket;
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("RES_LOGIN", id => {
      if (id === "-1")
      {
        alert("Vui lòng kiểm tra lại tài khoản và mật khẩu");
      }
      else
      {
        localStorage.setItem("id", id);
        localStorage.removeItem("other_id");
        localStorage.removeItem("other_username");
        navigate("../chat");
      }
    });
  }, []);

  async function handleLogin() {
    await socket.emit("LOGIN", {
      username,
      password
    });
  }

  return (
    <React.Fragment>
      <div className="login_ctn">
        <Signup trigger={signUpModal} setTrigger={setSignUpModal} />
        <div className="login_wrapper">
          <h1>
            <i className="fa-brands fa-rocketchat"></i>
            MYCHAT
          </h1>
          <form method="post">
            <div className="signup">
              Don't have an account? <span onClick={() => { setSignUpModal(true); }}>Sign up</span>
            </div>
            <div className="txt_field">
              <input type="text" required
                onChange={e => setUsername(e.target.value)}
              />
              <label>User name</label>
              <i className="fa-regular fa-user"></i>
            </div>
            <div className="txt_field">
              <input type="password" required
                onChange={e => setPassword(e.target.value)}
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>
          </form>
          {/* Ngan can submit */}
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </React.Fragment>
  )
}