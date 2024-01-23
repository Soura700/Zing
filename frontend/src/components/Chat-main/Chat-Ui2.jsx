import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicNoneIcon from "@mui/icons-material/MicNone";
import TelegramIcon from "@mui/icons-material/Telegram";
import "./chatui.css";

import { useNavigate } from "react-router-dom";

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
}) => {
  const [socket, setSocket] = useState(/* Your socket instance */);
  const [incomingCall, setIncomingCall] = useState(false);

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

  return (
    <div className="main-chat-section">
      <div className="info">
        <div className="left-part">
          <div className="backIcon">
            <ArrowBackIosIcon onClick={showSidebarMenu} />
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
              {/* Your existing code for the popup */}
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
          <LocationOnIcon className="chat-btn" />
          <MicNoneIcon className="chat-btn" />
        </div>
        <div className="submit-btn-class">
          <button onClick={() => sendMessage()}>
            <TelegramIcon className="submit-btn" />
          </button>
          {incomingCall && (
            <button onClick={handleAcceptButtonClick}>Accept</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatUI2;
