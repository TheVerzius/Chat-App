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
    const msgInputRef = useRef();
    const videoRef = useRef(null);
    const otherVideoRef = useRef(null);

    //
    const [isCalling, setIsCalling] = useState(false);
    //
    const socket = useAppContext().socket;
    const [otherId, setOtherId] = useState();
    const [otherUN, setOtherUN] = useState("Chưa chọn người nhận");

    const [peer, setPeer] = useState(() => {
        let id = localStorage.getItem("id");
        if (id)
        {
            return new Peer(id);
        }
        return null;
    });
    const [peerconn, setPeerconn] = useState();

    useEffect(() => {
        if (peerconn)
        {
            peerconn.close();
        }
        console.log("Reconnect to peer", otherId);
        setPeerconn(peer.connect(otherId));
        setChatList([]);
    }, [otherId]);

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
                if (receivedMsg.type)
                {
                    let bytes = new Uint8Array(receivedMsg.data); // pass your byte response to this constructor
                    let blob = new Blob([bytes], { type: receivedMsg.extension });// change resultByte to bytes

                    //let link = document.createElement('a');
                    // link.href = window.URL.createObjectURL(blob);
                    // link.download = `${receivedMsg.filename}`;
                    // link.click();
                    setChatList(prev => [...prev, <p key={prev.length} className="message">
                        <a href={window.URL.createObjectURL(blob)} download={receivedMsg.filename}>{receivedMsg.filename}</a>
                    </p>]);

                    return;
                }
                setChatList(prev => [...prev, <p key={prev.length} className="message">{receivedMsg}</p>]);
            });
        });
    }, [])

    function handleSendMsg() {
        if (msg)
        {
            setChatList(prev => [...prev, <p key={prev.length} className="message is_sent">{msg}</p>]);
            msgInputRef.current.value = "";
            peerconn.send(msg);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter')
        {
            handleSendMsg();
        }
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

    const makeCall = () => {
        setIsCalling(true);
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {

            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();

            const call = peer.call(otherId, mediaStream)

            call.on('stream', (remoteStream) => {
                otherVideoRef.current.srcObject = remoteStream
                otherVideoRef.current.play();
            });
        });
    }

    useEffect(() => {
        peer.on('call', (call) => {
            setIsCalling(true);
            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            getUserMedia({ video: true, audio: true }, (mediaStream) => {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
                call.answer(mediaStream)
                call.on('stream', function (remoteStream) {
                    otherVideoRef.current.srcObject = remoteStream
                    otherVideoRef.current.play();
                });
            });
        })
    }, [])


    const handleFile = async (e) => {
        const file = e.target.files[0];
        const filename = file.name;
        const extension = file.type;

        const byteFile = await getAsByteArray(file)
        let blob = new Blob([byteFile], { extension });// change resultByte to bytes
        setChatList(prev => [...prev, <p key={prev.length} className="message is_sent">
            <a href={window.URL.createObjectURL(blob)} download={filename}>{filename}</a>
        </p>]);

        peerconn.send({
            type: 'file',
            filename,
            extension,
            data: byteFile
        })
    }

    async function getAsByteArray(file) {
        return new Uint8Array(await readFile(file))
    }
    function readFile(file) {
        return new Promise((resolve, reject) => {
            // Create file reader
            let reader = new FileReader()

            // Register event listeners
            reader.addEventListener("loadend", e => resolve(e.target.result))
            reader.addEventListener("error", reject)

            // Read file
            reader.readAsArrayBuffer(file)
        })
    }

    const handleEndCall = () => {
        setIsCalling(false);
    }

    return (
        <React.Fragment>
            <div className="chat_ctn">
                {/* <div>
                    <video ref={videoRef} autoPlay width="320" height="240" />
                </div>
                <div>
                    <video ref={otherVideoRef} width="320" height="240" />
                </div> */}

                <Search trigger={searchModal} setTrigger={setSearchModal} setOtherId={setOtherId} setOtherUN={setOtherUN} />
                <div className="header">
                    <h1>
                        <i className="fa-brands fa-rocketchat"></i>
                        MYCHAT
                    </h1>
                    <div className="header_user">
                        {isCalling ? (<span onClick={handleEndCall} style={{ marginRight: 10 }}>End Call</span>) : ""}
                        <span onClick={makeCall} style={{ marginRight: 10 }}>Call</span>
                        <i className="fa-solid fa-circle-plus" onClick={() => { setSearchModal(true); }}></i>
                        <i className="fa-regular fa-circle-user" onClick={() => { navigate("../") }}></i>
                        <span>{username}</span>
                    </div>
                </div>
                {/* <div className="sidebar">
                    <RenderChatSidebar />
                </div> */}
                <div className="content">
                    <div className="content_user">
                        <i className="fa-regular fa-circle-user"></i>
                        {/* <span>{localStorage.getItem("other_username") ?? "Chưa chọn người nhận"}</span> */}
                        <span>{otherUN}</span>
                    </div>
                    <div className="chat_area" ref={chatAreaRef}>
                        {!isCalling ?
                            (chatList) :
                            (
                                <>

                                    <div className="call_cont">
                                        <video ref={videoRef} />
                                        <video ref={otherVideoRef} />
                                    </div>
                                </>
                            )
                        }

                    </div>
                    <div className="text_area">
                        <input className="choose_file" type="file" onChange={handleFile} />
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                        <input
                            ref={msgInputRef}
                            className="text-input"
                            type="text" placeholder="Aa"
                            onChange={e => setMsg(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <i className="fa-solid fa-arrow-right-to-bracket" onClick={handleSendMsg}></i>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}