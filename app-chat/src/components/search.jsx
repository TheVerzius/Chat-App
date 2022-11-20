import React, { useEffect, useState } from "react";
import { useAppContext } from "../App";
import "../styles/search.css";


export function Search(props) {
  const [otherIdInput, setOtherIdInput] = useState("");

  async function handleSearch() {
    await props.setOtherId(otherIdInput);
    props.setTrigger(false);
  }

  return props.trigger ? (
    <React.Fragment>
      <div className="search_ctn">
        <div className="search_header">
          <span>To:</span>
          <input className="text-input" type="text"
            onChange={e => setOtherIdInput(e.target.value)}
          />
          <i className="fa-solid fa-arrow-left-long" onClick={handleSearch}></i>
        </div>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
}