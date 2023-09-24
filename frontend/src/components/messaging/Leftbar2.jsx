import React, { useEffect } from "react";
import "./leftbar2.css";
import image from "../../assets/jd-chow-gutlccGLXKI-unsplash.jpg";
import SearchIcon from "@mui/icons-material/Search";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicNoneIcon from "@mui/icons-material/MicNone";
import TelegramIcon from "@mui/icons-material/Telegram";
import CollectionsIcon from "@mui/icons-material/Collections";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LockIcon from "@mui/icons-material/Lock";
import BlockIcon from "@mui/icons-material/Block";
import ReportIcon from "@mui/icons-material/Report";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";
import Peer from "simple-peer";

export const Leftbar2 = () => {
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [conversations, setConversations] = useState([]);
  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [activeUsers, setActiveUsers] = useState([]);

  const [isCalling, setIsCalling] = useState(false);
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);

  const [activeConversation, setActiveConversation] = useState(null);

  const startVideoCall = async () => {
    try {
      // Get user's video and audio stream
      const userMedia = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userMedia);

      // Create a new Peer instance
      const newPeer = new Peer({
        initiator: true,
        stream: userMedia,
        trickle: false,
      });

      // Set up event handlers for the Peer instance
      newPeer.on("signal", (data) => {
        // Send the offer signal to the other user (you will need to define a function to send this signal via your socket)
        // socket.emit("sendOfferSignal", { signalData: data, receiverId: receiverId });
      });

      newPeer.on("stream", (remoteStream) => {
        // Display the remote user's video stream (you may need to create a video element to display it)
        // remoteVideoRef.current.srcObject = remoteStream;
      });

      setPeer(newPeer);
      setIsCalling(true);
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  const answerVideoCall = async () => {
    try {
      // Get user's video and audio stream
      const userMedia = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userMedia);

      // Create a new Peer instance to answer the call
      const answeringPeer = new Peer({
        initiator: false,
        stream: userMedia,
        trickle: false,
      });

      // Set up event handlers for the answering Peer instance
      answeringPeer.on("signal", (data) => {
        // Send the answer signal to the caller (you will need to define a function to send this signal via your socket)
        // socket.emit("sendAnswerSignal", { signalData: data, callerId: callerId });
      });

      answeringPeer.on("stream", (remoteStream) => {
        // Display the remote caller's video stream (you may need to create a video element to display it)
        // remoteVideoRef.current.srcObject = remoteStream;
      });

      setPeer(answeringPeer);
      setIsCalling(true);
    } catch (error) {
      console.error("Error answering video call:", error);
    }
  };

  // console.log(messages.length);
  console.log(typeof messages);

  const parsedId = parseInt(id);

  const styles = {
    "*": {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
  };

  useEffect(() => {
    setSocket(io("http://localhost:5500"));
  }, []);

  useEffect(() => {
    checkAuthentication().then(() => {
      setIsLoading(false); // Mark loading as complete when authentication data is available
    });
  }, [checkAuthentication]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    // Only perform socket-related operations if the user is authenticated
    if (isLoggedIn) {
      socket?.emit("addUser", parsedId);
      socket?.on("getUser", (activeUsers) => {
        console.log("Active Users", activeUsers);
        setActiveUsers(activeUsers);
      });
      socket.on("getMessage", (data) => {
        console.log(data);
        setMessages((prev) => ({
          ...prev,
          messages: [...prev.messages, { message: data.message }],
        }));
      });

      // socket?.on('getMessage', (data) => {
      //   console.log(data);
      //   setMessages((prevMessages) => [...prevMessages, { message: data.message }]);
      // });

      // socket?.on('getMessage', (data) => {
      //   console.log(data);
      //   setMessages((prevMessages) => [...prevMessages, data]);
      // });
    }
  }, [socket, parsedId, isLoggedIn]);

  console.log("ActiveUser" + activeUsers);

  console.log(activeUsers);

  console.log(socket);

  const isUserOnline = (userId) => {
    // return activeUsers.find((user)=>user.userId ===  userId );
    return activeUsers.some((user) => user.userId === userId);
  };

  console.log(isUserOnline());

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        const res = await fetch("http://localhost:5000/api/conversation/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: parsedId,
          }),
        });
        const data = await res.json();
        setConversations(data);
      };
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchMessages = async (id, user) => {
    if (isLoggedIn) {
      const res = await fetch(
        "http://localhost:5000/api/message/get_messages/" + id
      );
      const resJson = await res.json();
      setMessages({ messages: resJson, receiver: user, conversationId: id });
      // setConversationId(id);
      setActiveConversation(user);
    }
  };

  // console.log(conversationId);

  // const fetchMessages = async (id) => {
  //   if (isLoggedIn) {
  //     const res = await fetch("http://localhost:5000/api/message/get_messages/" + id , {
  //       method:"GET",
  //       headers:{
  //         'Content-Type':'application/json'
  //       },
  //       body:JS
  //     });
  //     const resJson = await res.json();
  //     setMessages(resJson);
  //     console.log(resJson);
  //   }
  // };

  // const sendMessage = async (e) => {
  //   const conversationId = messages?.conversationId;

  //   console.log("Conversation Id" + conversationId);

  //   // if (!conversationId) {
  //   //   console.error('No conversation selected');
  //   //   return;
  //   // }

  //   socket?.emit("sendMessage", {
  //     conversationId: conversationId,
  //     senderId: parsedId,
  //     message: message,
  //     receiverId: messages?.receiver?.receiverId,
  //   });

  //   // setMessage('');

  //   try {
  //     if (!messages?.messages || !messages?.messages.length) {
  //       console.error("No conversation selected");
  //       return;
  //     }

  //     setMessages((prev) => ({
  //       ...prev,
  //       messages: [
  //         ...prev.messages,
  //         { message: message, user: { id: parsedId } }, // Assume the sender is the logged-in user
  //       ],
  //     }));

  //     const res = await fetch("http://localhost:5000/api/message/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         conversationId: conversationId,
  //         senderId: parsedId,
  //         message: message,
  //         // receiverId:""
  //       }),
  //     });
  //     if (res.status === 200) {
  //       // Message sent successfully to the API, now emit it to the server
  //       // socket?.emit("sendMessage", {
  //       //   senderId: parsedId,
  //       //   receiverId: /* Receiver's ID goes here */,
  //       //   message: message,
  //       // });

  //       // Clear the input field after sending
  //       setMessage("");
  //     } else {
  //       console.error("Failed to send message to the API");
  //       // Handle error appropriately, e.g., show an error message to the user
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  // const sendMessage = async () => {
  //   const conversationId = messages?.conversationId;

  //   if (!conversationId) {
  //     console.error("No conversation selected");
  //     return;
  //   }

  //   socket?.emit("sendMessage", {
  //     conversationId: conversationId,
  //     senderId: parsedId,
  //     message: message,
  //     receiverId: messages?.receiver?.receiverId,
  //   });

  //   try {
  //     const res = await fetch("http://localhost:5000/api/message/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         conversationId: conversationId,
  //         senderId: parsedId,
  //         message: message,
  //       }),
  //     });

  //     if (res.status === 200) {
  //       // Clear the input field after sending
  //       setMessage("");
  //     } else {
  //       console.error("Failed to send message to the API");
  //       // Handle error appropriately, e.g., show an error message to the user
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  const sendMessage = async () => {
    const conversationId = messages?.conversationId;

    if (!conversationId) {
      console.error("No conversation selected");
      return;
    }

    // Update the local state immediately to show the message in the outgoing message div
    setMessages((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { message: message, user: { id: parsedId } },
      ],
    }));

    socket?.emit("sendMessage", {
      conversationId: conversationId,
      senderId: parsedId,
      message: message,
      receiverId: messages?.receiver?.receiverId,
    });

    try {
      const res = await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          senderId: parsedId,
          message: message,
        }),
      });

      if (res.status === 200) {
        // Clear the input field after sending
        setMessage("");
      } else {
        console.error("Failed to send message to the API");
        // Handle error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Render loading indicator if still loading authentication data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the rest of your component based on the authentication status
  return (
    <div style={styles} className="container">
      {/* left-options bar */}

      <div className="left-opt-menu">
        <div className="container">
          <div className="items">
            <div className="profile-img">
              <img src={image} alt="" />
            </div>
            <div className="item1">
              <TextsmsIcon fontSize="medium" className="icon1" />
            </div>
            <div className="item2">
              <PeopleRoundedIcon fontSize="medium" className="icon2" />
            </div>
            <div className="item3">
              {/* <CallRoundedIcon fontSize="medium" className="icon3" /> */}
              <CallRoundedIcon
                fontSize="medium"
                className="icon3"
                onClick={() => {
                  if (!isCalling) {
                    startVideoCall();
                  } else {
                    // Handle hang up or end call
                    // You can implement this by stopping the stream, closing the Peer connection, and updating the call status
                    // stream.getTracks().forEach((track) => track.stop());
                    // peer.destroy();
                    // setIsCalling(false);
                  }
                }}
              />
            </div>
            <hr></hr>
            <div className="item4">
              <SettingsRoundedIcon fontSize="medium" className="icon4" />
            </div>
          </div>
        </div>
      </div>

      {/* left - activity bar */}
      <div className="left-menu">
        <div className="top-part">
          <div className="top-part-opt">
            <h1>Messages</h1>
          </div>
          <div className="top-search-bar">
            <input type="text" name="search-bar" placeholder="Search" />
            <div className="search-btn">
              <SearchIcon className="search-icon" />
            </div>
          </div>
          <div className="mid-part">
            <span>Pinned Messages</span>

            {
              // conversations.length>0?
              conversations.map((conversation, user, index) => {
                console.log(user);

                console.log(conversation.user);

                if (conversations.length > 0) {
                  return (
                    <div
                      className="mid-text"
                      key={index}
                      onClick={() =>
                        fetchMessages(
                          conversation.conversationId,
                          conversation.user
                        )
                      }
                    >
                      <div className="left">
                        <img
                          src={image}
                          alt=""
                          onClick={() =>
                            fetchMessages(
                              conversation.conversationId,
                              conversation.user
                            )
                          }
                        />
                        <div className="left-info">
                          <h2 onClick={() => console.log("Hello")}>
                            {/* {conversation.conversationUserData[0].username} */}
                            {conversation.user.username}
                          </h2>
                          <p className="activity">Lorem, ipsum dolor.</p>
                        </div>
                      </div>
                      <div className="right">
                        <p>9:26 PM</p>
                      </div>
                    </div>
                  );
                } else {
                  <div className="no-conversations">
                    No conversations to show.
                  </div>;
                }
              })
            }

            {/* <div className="mid-text3">
              <div className="left3">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">whats up</p>
                </div>
              </div>
              <div className="right3">
                <p>9:26 PM</p>
                <circle>2</circle>
              </div>
            </div> */}

            <span>All Conversations</span>

            <div className="mid-text4">
              <div className="left4">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">whats up</p>
                </div>
              </div>
              <div className="right4">
                <p>9:26 PM</p>
                <circle>11</circle>
              </div>
            </div>

            <div className="mid-text5">
              <div className="left5">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">typing...</p>
                </div>
              </div>
              <div className="right5">
                <p>9:26 PM</p>
                <circle>1</circle>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* main chat section */}

      <div className="main-chat-section">
        {messages?.messages?.length > 0 ? (
          <>
            <div className="info">
              <div className="left-part">
                <div className="user-pic">
                  <img src={image} alt=""></img>
                </div>
                <div className="user-info">
                  {/* {conversations.map((conversation, user, index) => {
                    console.log(conversation);

                    const onlineStatus = isUserOnline(
                      conversation.user.receiverId
                    )
                      ? "Online"
                      : "Offline";

                    if (conversations.length > 0) {
                      return (
                        <div className="left-info">
                          <h1>{conversation.user.username}</h1>
                          <p>{onlineStatus}</p>
                        </div>
                      );
                    }
                  })} */}
                  <div className="user-info">
                    {activeConversation && (
                      <>
                        <h1>{activeConversation.username}</h1>
                        <p>
                          {isUserOnline(activeConversation.receiverId)
                            ? "Online"
                            : "Offline"}
                        </p>
                      </>
                    )}
                  </div>

                  {/* <h1>John Doe</h1>*/}
                  {/* <p>Online</p>  */}
                </div>
              </div>
              <div className="right-part">
                <CallRoundedIcon className="right-part-icon" />
                <VideocamIcon className="right-part-icon" />
                <MoreVertIcon
                  className="right-part-icon"
                  onClick={handleToggle}
                />
                {toggle ? (
                  <div className="RightPopUpShow">
                    <div className="PopUpBox">
                      <div className="top">
                        <img src={image} alt=""></img>
                        <h1>John Doe</h1>
                        <p>Online</p>
                      </div>
                      <div className="mid1">
                        <CallRoundedIcon className="mid1-icon" />
                        <VideocamIcon className="mid1-icon" />
                      </div>
                      <div className="mid2">
                        <div className="userOpt">
                          <CollectionsIcon className="right-part-icon" />
                          <h2>Media</h2>
                        </div>
                      </div>
                      <div className="mid3">
                        <div className="userOpt">
                          <VolumeOffIcon className="right-part-icon" />
                          <h2>Mute Chat</h2>
                        </div>
                      </div>
                      <div className="mid4">
                        <div className="userOpt">
                          <ArrowBackIosIcon className="right-part-icon" />
                          <h2>Close Chat</h2>
                        </div>
                      </div>
                      <div className="mid5">
                        <div className="userOpt">
                          <LockIcon className="right-part-icon" />
                          <h2>Chat Lock</h2>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="userOpt1">
                          <BlockIcon className="bottom-icon" />
                          <h2>Block</h2>
                        </div>
                        <div className="userOpt2">
                          <ReportIcon className="bottom-icon" />
                          <h2>Report</h2>
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
              {messages.messages.map(
                ({ message, user: { id } = {} }, index) => {
                  if (id === parsedId) {
                    return (
                      <div className="outgoing-msg" key={index}>
                        {message}
                      </div>
                    );
                  } else {
                    return (
                      <div className="incoming-msg" key={index}>
                        {message}
                      </div>
                    );
                  }
                }
              )}
            </div>

            <div className="chat-bottom">
              <div className="chat-input">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a Message"
                />
              </div>
              <div className="chat-options">
                <input
                  type="file"
                  accept="image/*" // Accept only image files
                  id="imageInput"
                  style={{ display: "none" }}
                  // onChange={handleImageSelect}
                />
                {/* <PhotoSizeSelectActualIcon className="chat-btn" /> */}
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
          </>
        ) : (
          <div
            className="no-conversations"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            No Messages to show.Click on the conversation to see the messages
          </div>
        )}
      </div>
    </div>
  );
};
