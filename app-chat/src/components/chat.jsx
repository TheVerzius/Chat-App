import { Peer } from "peerjs";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import "../styles/chat.css";
import { Search } from "./search";

export function Chat() {
    const [searchModal, setSearchModal] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [friendList, setFriendList] = useState([]);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const chatAreaRef = useRef();
    const [chatList, setChatList] = useState([]);

    const socket = useAppContext().socket;
    const [otherId, setOtherId] = useState(-10);
    const [peerconn, setPeerconn] = useState();
    const [peer, setPeer] = useState(() => {
        let id = localStorage.getItem("id");
        if (id)
        {
            return new Peer(id);
        }
        return null;
    });

    useEffect(() => {
        console.log("Reconnect to peer", otherId);
        setPeerconn(peer.connect(otherId));
    }, [otherId])

    useEffect(() => {
        socket.on("RES_GET_INFO", data => {
            setUsername(data.username);
            setFriendList(data.friendList);
            setEmail(data.email);
        })
    }, [])

    useEffect(() => {
        let id = localStorage.getItem("id");
        console.log("user id: ", id);
        socket.emit("GET_INFO", id);
    }, [])

    useEffect(() => {
        peer.on("connection", (conn) => {
            conn.on("data", (receivedMsg) => {
                chatList.push(<p key={chatList.length} className="message">{receivedMsg}</p>);
                setChatList([...chatList]);
            });
        });
    }, [])

    function handleSendMsg() {
        //console.log(peer);

        peerconn.send(msg);
        chatList.push(<p key={chatList.length} className="message is_sent">{msg}</p>);
        setChatList([...chatList]);
    }

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

    const RenderChat = () => {
        // let list = []
        // for (let i = 0; i < 5; i++)
        //     list.push(<p key={i} className="message is_sent">Lorem, ipsum dolor sit am...lorem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum alias earum ipsam sit nulla natus officiis dolorum placeat cum laborum, velit blanditiis porro eligendi aut perspiciatis dicta minima, a enim?</p>)
        return chatList;
    }

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
                <Search trigger={searchModal} setTrigger={setSearchModal} setOtherId={setOtherId} />
                <div className="header">
                    <h1>
                        <i className="fa-brands fa-rocketchat"></i>
                        MYCHAT
                    </h1>
                    <div className="header_user">
                        <i className="fa-solid fa-circle-plus" onClick={() => { setSearchModal(true); }}></i>
                        <i className="fa-regular fa-circle-user" onClick={() => { navigate("../") }}></i>
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
                    <div className="chat_area" ref={chatAreaRef}>
                        <RenderChat />
                        {/* <p className="message">Lorem, ipsum dolor sit am...lorem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum alias earum ipsam sit nulla natus officiis dolorum placeat cum laborum, velit blanditiis porro eligendi aut perspiciatis dicta minima, a enim?</p> */}
                    </div>
                    <div className="text_area">
                        <input className="choose_file" type="file" />
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                        <input
                            className="text-input"
                            type="text" placeholder="Aa"
                            onChange={e => setMsg(e.target.value)}
                        />
                        <i className="fa-solid fa-arrow-right-to-bracket" onClick={handleSendMsg}></i>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}