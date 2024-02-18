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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./chatui.css";
import { ToastContainer } from "react-toastify";

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
  mobileZindex,
  clickToggle,
}) => {
  const [socket, setSocket] = useState(/* Your socket instance */);
  const [incomingCall, setIncomingCall] = useState(false);
  const [blocked, setIsBlocked] = useState(false);
  const [clicked, setClicked] = useState(true);
  const [blockingUserId, setblockingUserId] = useState(null);
  const [blockList, setBlockList] = useState([]);
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
    const checkBlock = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/conversation/checkBlocked",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              conversationId: messages.conversationId,
              userIdToCheck: activeConversation.receiverId,
            }),
          }
        );
        const resJson = await res.json();
        console.log("Result");
        console.log(resJson);
        console.log(resJson.blockedUsers);
        if (resJson.blocked === true) {
          setIsBlocked(true);
          if (resJson.blockingUserId) {
            setblockingUserId(resJson.blockingUserId);
            setBlockList(resJson.blockedUsers);
          }
        }
        if (res.ok) {
        }
        const data = await res.json();
        console.log("success:", data);
      } catch (error) {
        // console.error("error", error.message);
      }
    };
    checkBlock();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming calls
      socket.on("incomingCallAlert", (data) => {
        setIncomingCall(true);
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    // If the receiver is blocked, show a toast message and return
    if (blocked) {
      if (blockingUserId == parsedId) {
        toast.error("Please unblock the user to chat");
        return;
      } else {
        // toast.error("You are blocked");
        return;
      }
    }
    // Otherwise, proceed with sending the message
    sendMessage();
  };

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

  const handleArrowButtonClick = () => {
    setClicked((prevClicked) => {
      if (prevClicked) {
        navigate("/message");
        window.location.reload();
      }
      return !prevClicked;
    });
  };

  const customStyle = { zIndex: !clicked ? 0 : mobileZindex };

  const handleBlock = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/conversation/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: messages.conversationId,
          userIdToBlock: activeConversation.receiverId,
          blockingUserId: parsedId,
        }),
      });
      if (res.ok) {
        window.location.reload();
        throw new Error("error");
      }
      const data = await res.json();
      console.log("success:", data);
    } catch (error) {
      // console.error("error", error.message);
    }
  };

  const handleUnblock = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/conversation/unblock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: messages.conversationId,
            userIdToUnblock: activeConversation.receiverId,
            unblockingUserId: parsedId,
          }),
        }
      );
      if (res.ok) {
        window.location.reload();
        setIsBlocked(false);
        throw new Error("error");
      }
      const data = await res.json();
      console.log("success:", data);
    } catch (error) {
      // console.error("error", error.message);
    }
  };

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
                {!blockList.includes(
                  activeConversation.receiverId
                ) && (
                  <p>
                    {isUserOnline(activeConversation.receiverId)
                      ? "Online"
                      : "Offline"}
                  </p>
                )}
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
                {blocked === true && blockingUserId === parsedId ? (
                  <div className="bottom" onClick={handleUnblock}>
                    <div className="userOpt1">
                      <BlockIcon className="bottom-icon" />
                      <h2>Unblock</h2>
                    </div>
                  </div>
                ) : (
                  <div className="bottom" onClick={handleBlock}>
                    <div className="userOpt1">
                      <BlockIcon className="bottom-icon" />
                      <h2>Block</h2>
                    </div>
                  </div>
                )}
                {/* <div className="bottom" onClick={handleBlock}>
                  <div className="userOpt1">
                    <BlockIcon className="bottom-icon" />
                    <h2>Block</h2>
                  </div>
                </div> */}
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
        {/* <div className="senders-photo">
          <img src="your_sender_image_url" alt="Sender" className="senderPic"/>
        </div>
        <div className="recievers-photo">
          <img src="your_receiver_image_url" alt="Receiver" className="receiverPic"/>
        </div> */}
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
          {/* <button onClick={() => sendMessage()}> */}
          <button onClick={() => handleSendMessage()}>
            <ArrowUpwardRoundedIcon className="submit-btn" />
          </button>
          {incomingCall && (
            <button onClick={handleAcceptButtonClick}>Accept</button>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ChatUI2;
