import { Peer } from "peerjs";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import "../styles/chat.css";
import { Search } from "./search";

export function Chat() {

    const navigate = useNavigate();
    const chatAreaRef = useRef();
    const socket = useAppContext().socket; // Lấy socket từ AppContext được import từ App.js

    const [searchModal, setSearchModal] = useState(false); // Chỉnh Modal Search
    const [username, setUsername] = useState(""); // Tên người dùng
    const [email, setEmail] = useState(""); // Email người dùng
    const [friendList, setFriendList] = useState([]); // Danh sách bạn bè
    const [msg, setMsg] = useState(""); // Tin nhắn
    const [chatList, setChatList] = useState([]); // Chat list

    const [otherId, setOtherId] = useState(-10); // ID người chat còn lại
    const [peerconn, setPeerconn] = useState();

    // Tạo peer

    function createPeer() {
        let id = localStorage.getItem("id");
        if (id) {
            return new Peer(id);
        }
        return null;
    }

    const [peer, setPeer] = useState([]);

    // Mỗi khi otherID thay đổi thì reconnect lại

    useEffect(() => {
        console.log("Reconnect to peer", otherId);
        peer.push(createPeer());
        setPeer([...peer])
        console.log(peer, "abc");
        setPeerconn(peer[peer.length - 1].connect(otherId));
    }, [otherId])

    // Chỉ chạy khi render lần đầu tiên để tạo ra sự kiện socket RES_GET_INFO

    useEffect(() => {
        socket.on("RES_GET_INFO", data => {
            setUsername(data.username);
            setFriendList(data.friendList);
            setEmail(data.email);
        })
    }, [])

    // Lấy id chat từ LocalStorage 
    // và lấy info người dùng thông qua GET_INFO và id

    useEffect(() => {
        let id = localStorage.getItem("id");
        console.log("user id: ", id);
        socket.emit("GET_INFO", id);
    }, [])

    // Chỉ chạy khi render lần đầu tiên để lắng nghe sự kiện
    // khi connection và từ đó, khi nhận data từ remote peer

    useEffect(() => {
        for(let i = 0; i < peer.length; i++) {
            peer[i].on("connection", (conn) => {
                conn.on("data", (receivedMsg) => {
                    console.log("rêcive");
                    chatList.push(<p key={chatList.length} className="message">{receivedMsg}</p>);
                    setChatList([...chatList]);
                });
            });
        }
    }, [peer])

    // Xử lý tin nhắn gửi

    function handleSendMsg() {
        //console.log(peer);
        peerconn.send(msg);
        console.log("send");
        chatList.push(<p key={chatList.length} className="message is_sent">{msg}</p>);
        setChatList([...chatList]);
    }

    // Sidebar component

    const RenderChatSidebar = () => {
        let list = []
        for (let i = 0; i < 10; i++)
            list.push(
                <div className="sidebar_chat" key={i}>
                    <i className="fa-regular fa-circle-user"></i>
                    <div>
                        <h2>ABC</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa</p>
                    </div>
                    <i className="fa-solid fa-chevron-right"></i>
                </div>)
        return list;
    }

    // Chat component

    const RenderChat = () => {
        return chatList;
    }

    // Đặt tên file trong chat đúng bằng tên của file mỗi khi upload

    useEffect(() => {
        var inputs = document.querySelectorAll('.choose_file');
        Array.prototype.forEach.call(inputs, function (input) {
            var label = document.querySelectorAll('.text-input'),
                labelVal = label[0].placeholder;

            input.addEventListener('change', function (e) {
                var fileName = '';
                if (this.files && this.files.length > 1)
                    fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                else
                    fileName = e.target.value.replace('C:\\fakepath\\', '');

                if (fileName)
                    label[0].placeholder = fileName;
                else
                    label[0].placeholder = labelVal;
            });
        });
    });

    return (
        <React.Fragment>
            <div className="chat_ctn">
                <Search 
                    trigger={searchModal} 
                    setTrigger={setSearchModal} 
                    setOtherId={setOtherId} 
                    listFriend={friendList}
                />
                <div className="header">
                    <h1>
                        <i className="fa-brands fa-rocketchat"></i>
                        MYCHAT
                    </h1>
                    <div className="header_user">
                        <i 
                            className="fa-solid fa-circle-plus" 
                            onClick={() => { setSearchModal(true); }}>
                        </i>
                        <i 
                            className="fa-regular fa-circle-user" 
                            onClick={() => { navigate("../") }}>
                        </i>
                        <span>{username}</span>
                    </div>
                </div>
                <div className="sidebar">
                    <RenderChatSidebar />
                </div>
                <div className="content">
                    <div className="content_user">
                        <i className="fa-regular fa-circle-user"></i>
                        <span>{username}</span>
                    </div>
                    <div 
                        className="chat_area" 
                        ref={chatAreaRef}>
                            <RenderChat />
                    </div>
                    <div className="text_area">
                        <input 
                            className="choose_file" 
                            type="file" 
                            onChange={e => setMsg(e.target.value)}
                        />
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                        <input
                            className="text-input"
                            type="text" placeholder="Aa"
                            onChange={e => setMsg(e.target.value)}
                        />
                        <i 
                            className="fa-solid fa-arrow-right-to-bracket" 
                            onClick={handleSendMsg}>
                        </i>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}