import React, { useEffect, useState } from "react";
import { useAppContext } from "../App";
import "../styles/search.css";


export function Search(props) {
  const [otherUsername, setOtherUsername] = useState("");
  const socket = useAppContext().socket;

  useEffect(() => {
    socket.on('RES_GET_INFO_BY_NAME', async (data) => {
      if (data.id === '-1')
      {
        alert(`Không tìm thấy tên người dùng này. Vui lòng nhập lại!!`);
      }
      else
      {
        localStorage.setItem("other_id", data.id);
        // localStorage.setItem("other_username", data.username);
        props.setOtherUN(data.username);
        props.setOtherId(data.id);
        props.setTrigger(false);
      }
    });
  }, []);

  function handleSearch() {
    socket.emit('GET_INFO_BY_NAME', otherUsername);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter')
    {
      handleSearch();
    }
  }

  return props.trigger ? (
    <React.Fragment>
      <div className="search_ctn">
        <div className="search_header">
          <span>To:</span>
          <input className="text-input" type="text"
            placeholder="Nhập tên người nhận ở đây"
            style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
            onChange={e => setOtherUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <i className="fa-solid fa-arrow-left-long" onClick={handleSearch}></i>
        </div>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
}