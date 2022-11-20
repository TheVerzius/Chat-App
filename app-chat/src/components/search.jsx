import React, { useEffect, useState } from "react";
import { useAppContext } from "../App";
import "../styles/search.css";

export function Search(props) {
  const [username, setUsername] = useState("");
  const socket = useAppContext().socket;
  const peer = useAppContext().peer;

  useEffect(() => {
    // socket.on("RES_GET_INFO_BY_NAME", data => {
    //   const conn = peer.connect(data.id);
    //   conn.on("open", () => {
    //     conn.send("hi!");
    //   });

    //   peer.on("connection", (conn) => {
    //     conn.on("data", (data) => {
    //       console.log(data);
    //     });
    //     conn.on("open", () => {
    //       conn.send("hello!");
    //     });
    //   });
    // });
  }, [])

  async function handleSearch() {
    await socket.emit("GET_INFO_BY_NAME", username);
    props.setTrigger(false);
  }

  return props.trigger ? (
    <React.Fragment>
      <div className="search_ctn">
        <div className="search_header">
          <span>To:</span>
          <input className="text-input" type="text"
            onChange={e => setUsername(e.target.value)}
          />
          <i class="fa-solid fa-arrow-left-long" onClick={handleSearch}></i>
        </div>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
}