import { useEffect, useState } from "react";
import { useAppContext } from "../App";
import "../styles/signUp.css";

export function Signup(props) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const socket = useAppContext().socket;

  useEffect(() => {
    socket.on("RES_SIGN_UP", status => {
      if (status === true) {
        props.setTrigger(false);
        alert("Đăng ký thành công!");
        setEmail("");
        setUsername("");
        setPassword("");
        setRepassword("");
      } else {
        alert("Đăng ký thất bại!\nVui lòng thử lại!");
      }
    })
  }, [])

  async function handleSignUp() {
    if (password !== repassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      alert("Vui lòng kiểm tra lại định dạng email!");
      return;
    }

    await socket.emit("SIGN_UP", {
      username,
      password,
      email
    })
  }

  return props.trigger ? (
    <>
      <div className="signup_ctn">
        <div className="signup_wrapper">
          <h1>
            Sign Up
            <i className="fa-solid fa-xmark" onClick={() => { props.setTrigger(false); }}></i>
          </h1>
          <form method="post">
            <div className="signup_txt_field">
              <input type="text" required
                onChange={e => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="signup_txt_field">
              <input type="text" required
                onChange={e => setUsername(e.target.value)}
              />
              <label>User name</label>
            </div>
            <div className="signup_txt_field">
              <input type="password" required
                onChange={e => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <div className="signup_txt_field">
              <input type="password" required
                onChange={e => setRepassword(e.target.value)}
              />
              <label>Re-type Password</label>
            </div>
            <div className="login_back">
              Already have an account? <span onClick={() => { props.setTrigger(false); }}>Login</span>
            </div>
            <button type="button" onClick={handleSignUp}>Sign up</button>
          </form>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}