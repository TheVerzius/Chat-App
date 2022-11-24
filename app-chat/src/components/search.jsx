import { Button } from "bootstrap";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../App";
import "../styles/search.css";


export function Search(props) {

  const [otherIdInput, setOtherIdInput] = useState("");

  async function handleSearch() {
    await props.setOtherId(otherIdInput);
    props.setTrigger(false);
    setOtherIdInput("");
  }

  const RenderFriendList = () => {
    let list = []
    for (let i = 0; i < props.listFriend.length; i++)
      if(props.listFriend[i].toString().includes(otherIdInput)) {
        list.push(<button 
                    key={i}
                    className="search_value" 
                    onClick={handleSearch}>
                      {props.listFriend[i]}
                  </button>)}
    return list;
  }

  function returnToChat() {
    props.setTrigger(false);
  }

  return props.trigger ? (
    <React.Fragment>
      <div className="search_ctn">
        <div className="search_header">
          <span>To:</span>
          <input className="text-input" type="text" value={otherIdInput}
            onChange={e => setOtherIdInput(e.target.value)}
          />
          <button 
            className="search_contact"
            onClick={handleSearch}>
              Add
          </button>
          <i className="fa-solid fa-arrow-left-long" onClick={returnToChat}></i>
        </div>
        <div className="search_result">
            <RenderFriendList />
        </div>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
}