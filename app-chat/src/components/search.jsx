import React, { useEffect, useState } from "react";
import { useAppContext } from "../App";
import "../styles/search.css";


export function Search(props) {
  const [id, setId] = useState("");
  const peer = useAppContext().peer;

  useEffect(() => {
  }, [])

  async function handleSearch() {
    //await socket.emit("GET_INFO_BY_NAME", username);
    const conn = peer.connect(id);
    conn.on("open", () => {
      conn.send("hi from tack Network!");
    });
    props.setTrigger(false);
  }

  return props.trigger ? (
    <React.Fragment>
      <div className="search_ctn">
        <div className="search_header">
          <span>To:</span>
          <input className="text-input" type="text"
            onChange={e => setId(e.target.value)}
          />
          <i className="fa-solid fa-arrow-left-long" onClick={handleSearch}></i>
        </div>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
}