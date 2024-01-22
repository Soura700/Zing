import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicNoneIcon from "@mui/icons-material/MicNone";
import TelegramIcon from "@mui/icons-material/Telegram";
import "./chatui.css";

const ChatUI = ({
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
  const [peer, setPeer] = useState(null);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerStream, setCallerStream] = useState(null);
  const userVideo = useRef();
  const partnerVideo = useRef();

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
      socket.on("incomingCall", (data) => {
        setIncomingCall(true);
        setCallerSignal(data.signal);
      });
    }
  }, [socket]);

  const callUser = (id) => {
    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream: mediaStream,
    });

    newPeer.on("signal", (data) => {
      // Send call signal to the other user
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: parsedId,
      });
    });

    newPeer.on("stream", (stream) => {
      // Display caller's video
      partnerVideo.current.srcObject = stream;
      setCallerStream(stream);
    });

    socket.on("callAccepted", (data) => {
      // Set the signal from the callee
      setCallAccepted(true);
      newPeer.signal(data.signal);
    });

    setPeer(newPeer);
  };

  const answerCall = () => {
    alert("Called");
    const newPeer = new Peer({
      initiator: false,
      trickle: false,
      stream: mediaStream,
    });

    newPeer.on("signal", (data) => {
      // Send answer signal to the caller
      console.log("Data");
      console.log(data);
      socket.emit("answerCall", { signal: data, to: parsedId });
    });
    // Ensure that partnerVideo.current is defined before setting srcObject
    if (partnerVideo.current) {
      newPeer.on("stream", (stream) => {
        // Display receiver's's video
        partnerVideo.current.srcObject = stream;
      });
    } else {
      console.error("partnerVideo.current is undefined or null");
    }

    if (userVideo.current) {
      userVideo.current.srcObject = callerStream;
    } else {
      console.error("userVideo.current is undefined or null");
    }

    newPeer.signal(callerSignal);
    setPeer(newPeer);
  };

  console.log(partnerVideo);

  const handleCallButtonClick = () => {
    // Call logic here
    const friendId = messages.receiver.receiverId;
    if (!peer) {
      callUser(friendId);
    }
  };

  const handleAcceptButtonClick = () => {
    // Answer the incoming call
    answerCall(callerStream);
    setIncomingCall(false);
  };

  useEffect(() => {
    // Fetch and set media stream here
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMediaStream(stream);
        userVideo.current.srcObject = stream;
      })
      .catch((error) => console.error("Error accessing media devices:", error));

    return () => {
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
    };
  }, [peer]);

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
          <CallRoundedIcon
            className="right-part-icon"
            onClick={handleCallButtonClick}
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
        <video ref={userVideo} autoPlay />
        <video ref={partnerVideo} autoPlay />
        {callAccepted && <video ref={partnerVideo} autoPlay />}
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
          {incomingCall &&
            (alert("Button"),
            (<button onClick={handleAcceptButtonClick}>Accept</button>))}
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
