/* chatui2.jsx */


import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import BlockIcon from "@mui/icons-material/Block";
import ReportIcon from "@mui/icons-material/Report";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicNoneIcon from "@mui/icons-material/MicNone";
import TelegramIcon from "@mui/icons-material/Telegram";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import "./chatui.css";

import { useNavigate } from "react-router-dom";
import { Hidden } from "@mui/material";

const ChatUI2 = ({
  showSidebarMenu,
  handleToggle,
  toggle,
  activeConversation,
  messages,
  parsedId,
  setMessage,
  sendMessage,
  isUserOnline,
  activeUsers,
  profileImg,
  showMessageBox,
  mobileZindex,
  clickToggle
}) => {
  // alert("Clicked Toggle " + clickToggle);
  const [socket, setSocket] = useState(/* Your socket instance */);
  const [incomingCall, setIncomingCall] = useState(false);
  // const [ mobileZindex , setMobileZindex] = useState(1);
  const [clicked, setClicked] = useState(true);
  const [btntoggle, setBtntoggle] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io("http://localhost:5500");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming calls
      socket.on("incomingCallAlert", (data) => {
        console.log("Hellloooooooooooooooooooo" + data);
        setIncomingCall(true);
      });
    }
  }, [socket]);

  // useEffect(() => {
  //   if (clickToggle) {
  //       setClicked(false);
  //   }
  //   // clickToggle=false;
  // }, [clicked]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const chatSection = document.querySelector(".main-chat-section");
  //     // const sidebarMenu = document.querySelector(".showFullMenu");
  //     if (
  //       chatSection &&
  //       !chatSection.contains(event.target)
        
  //       // && !sidebarMenu.contains(event.target)
  //     ) {
  //       // Clicked outside of the chat section and sidebar menu, close it
  //       setClicked(false);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const chatSection = document.querySelector(".main-chat-section");
  //     if (chatSection && !chatSection.contains(event.target)) {
  //       // Clicked outside of the chat section, close it
  //       setClicked(false);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);


  const handleMessageButtonClick = () => {
    socket.emit("initiateCall", {
      receiverId: messages.receiver.receiverId,
      callerId: parsedId,
    });
    navigate("/videocall", {
      state: { userId: messages.receiver.receiverId, clicked: true },
    });
  };

  const handleAcceptButtonClick = () => {
    navigate("/videocall", {
      state: { userId: messages.receiver.receiverId, clicked: true },
    });
  };
  // useEffect(()=>{
  //   if(clicked){
  //     menuZIndex();
  //   } 
  // },[clicked])
  // const menuZIndex = () => {
  //   // Update z-index when showSidebarMenu is clicked
  //   alert("Clicked");
  //   setClicked(!clicked);
  //   // Other logic for showing the sidebar menu
  // };
  // const customStyle = clicked ? { zIndex: 0 }: { zIndex: mobileZindex };

  // const handleArrowButtonClick = () => {
  //   alert("CLICKED");
  //   // const customStyle = { visibility: clicked ? "hidden" : "visible" }
  //   // showSidebarMenu(); // Call the function to handle sidebar menu visibility
  //   setClicked(true); // Set clicked to false to show the main-chat-section
  // };

  const handleArrowButtonClick = () => {
  setClicked((clicked) => {
    alert("Previous clicked state:" + clicked);
    return !clicked; // Toggle the previous state
  });
};
  // const customStyle = {   zIndex: mobileZindex , visibility: clicked ? "hidden" : "visible" }

  // alert(mobileZindex);

  const customStyle = { zIndex: !clicked ? 0 : mobileZindex}


  // alert("sidebar = "+ showSidebarMenu);
  return (
    <div className="main-chat-section" style={customStyle}>
      <div className="info">
        <div className="left-part">
          <div className="backIcon">
            <ArrowBackIosIcon onClick={handleArrowButtonClick} />
          </div>
          <div className="user-pic">
            <img src={`http://localhost:5000/${profileImg}`} alt="User" />
          </div>
          <div className="user-info">
            {activeConversation && (
              <div className="user-info">
                <h1>{activeConversation.username}</h1>
                <p>
                  {isUserOnline(activeConversation.receiverId)
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="right-part">
          {/* <Link to={`/videocall/${messages.receiver.receiverId}`}> */}
          <CallRoundedIcon
            onClick={handleMessageButtonClick}
            className="right-part-icon"
          />
          {/* </Link> */}

          <VideocamIcon className="right-part-icon" />
          <MoreVertIcon className="right-part-icon" onClick={handleToggle} />
          {toggle ? (
            <div className="RightPopUpShow">
              <div className="PopUpBox">
                <div className="top">
                  <img src={`http://localhost:5000/${profileImg}`} alt=""></img>
                  <h1>{activeConversation.username}</h1>
                </div>
                {/* <div className="mid2">
                          <div className="userOpt">
                            <CollectionsIcon className="right-part-icon" />
                            <h2>Media</h2>
                          </div>
                        </div> */}
                {/* <div className="mid3">
                          <div className="userOpt">
                            <VolumeOffIcon className="right-part-icon" />
                            <h2>Mute Chat</h2>
                          </div>
                        </div> */}
                {/* <div className="mid4">
                          <div className="userOpt">
                            <ArrowBackIosIcon className="right-part-icon" />
                            <h2>Close Chat</h2>
                          </div>
                        </div> */}
                {/* <div className="mid5">
                          <div className="userOpt">
                            <LockIcon className="right-part-icon" />
                            <h2>Chat Lock</h2>
                          </div>
                        </div> */}
                <div className="bottom">
                  <div className="userOpt1">
                    <BlockIcon className="bottom-icon" />
                    <h2>Block</h2>
                  </div>
                  <div className="userOpt2">
                    <ReportIcon className="bottom-icon" />
                    <h2>Leave</h2>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="RightPopUpDefault"></div>
          )}
        </div>
      </div>

      <div className="inner-container">
        {messages?.messages?.map(({ message, user: { id } = {} }, index) => (
          <div
            key={index}
            className={id === parsedId ? "outgoing-msg" : "incoming-msg"}
          >
            {message}
          </div>
        ))}
        <div className="senders-photo">
          <img src="your_sender_image_url" alt="Sender" />
        </div>
        <div className="recievers-photo">
          <img src="your_receiver_image_url" alt="Receiver" />
        </div>
      </div>

      <div className="chat-bottom">
        <div className="chat-input">
          <input
            type="text"
            value={messages?.message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a Message"
          />
        </div>
        <div className="chat-options">
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            style={{ display: "none" }}
          />
          <label htmlFor="imageInput">
            <PhotoSizeSelectActualIcon className="chat-btn" />
          </label>
          {/* <LocationOnIcon className="chat-btn" />
          <MicNoneIcon className="chat-btn" /> */}
        </div>
        <div className="submit-btn-class">
          <button onClick={() => sendMessage()}>
            <ArrowUpwardRoundedIcon className="submit-btn" />
          </button>
          {incomingCall &&
            (alert("accept button below"),
            (<button onClick={handleAcceptButtonClick}>Accept</button>))}
        </div>
      </div>
    </div>
  );
};

export default ChatUI2;
