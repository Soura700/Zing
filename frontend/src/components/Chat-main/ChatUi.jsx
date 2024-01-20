import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicNoneIcon from "@mui/icons-material/MicNone";
import TelegramIcon from "@mui/icons-material/Telegram";
import CircularProgress from "@mui/material/CircularProgress";
import "./chatui.css";

const ChatUI = ({
  showSidebarMenu,
  handleCallClick,
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
  showMessageBox
}) => {


  // alert(showMessageBox);

  return (
    <div className="main-chat-section">
      <div className="info">
        <div className="left-part">
          <div className="backIcon">
            <ArrowBackIosIcon onClick={showSidebarMenu} />
          </div>
          <div className="user-pic">
            {/* <img src={activeConversation?.userImage} alt="User" /> */}
            <img src={`http://localhost:5000/${profileImg}`} alt="User"/>
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
          <CallRoundedIcon
            onClick={handleCallClick}
            className="right-part-icon"
          />
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
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
