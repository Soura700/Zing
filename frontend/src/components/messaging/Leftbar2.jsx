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
import GroupsIcon from "@mui/icons-material/Groups";
import { useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import CallUI from "../../components/CallUi/CallUi";
import ringtone from "../../assets/Chaleya.mp3";
import IncomingCallUi from "../IncomingCallUi/IncomingCallUi";
import { useParams } from "react-router-dom";

export const Leftbar2 = () => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const { userId } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [audio] = useState(new Audio(ringtone));
  const userid = parseInt(userId);

  const styles = {
    "*": {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
  };

  useEffect(() => {
    const newSocket = io("http://localhost:5500");

    setSocket(newSocket);

    newSocket.on("incomingCall", ({ callerId }) => {
      console.log("CallerId" + callerId);
      setIncomingCall({ callerId });
    });

    newSocket.on("getUser", (activeUsers) => {
      console.log("Active Users", activeUsers);
      setActiveUsers(activeUsers);
    });

    newSocket.on("getMessage", (data) => {
      console.log(data);
      setMessages((prev) => ({
        ...prev,
        messages: [...prev.messages, { message: data.message }],
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCallClick = () => {
    if (!activeConversation) {
      console.error("No conversation selected for the call.");
      return;
    }
    const isCaller = activeConversation.receiverId !== userid;
    socket.emit("callUser", { receiverId: activeConversation.receiverId });
    startAudioCall(activeConversation.receiverId);
    setIsCallActive(true);
  };

  const acceptCall = () => {
    startAudioCall(incomingCall.callerId);
    setCallAccepted(true);
  };

  const rejectCall = () => {
    setIncomingCall(null);
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (userid && socket) {
      socket?.emit("addUser", userid);
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
    }
  }, [userid, socket]);

  useEffect(() => {
    if (userid) {
      const fetchData = async () => {
        const res = await fetch(
          "http://localhost:5000/api/conversation/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderId: userid,
            }),
          }
        );
        const data = await res.json();
        console.log("Data", data);
        setConversations(data);
      };
      fetchData();
    }
  }, [userid]);

  const fetchMessages = async (id, user) => {
    if (userid) {
      const res = await fetch(
        "http://localhost:5000/api/message/get_messages/" + id
      );
      const resJson = await res.json();
      setMessages({
        messages: resJson,
        receiver: user,
        conversationId: id,
      });
      setActiveConversation(user);
    }
  };

  const sendMessage = async () => {
    const conversationId = messages?.conversationId;

    if (!conversationId) {
      console.error("No conversation selected");
      return;
    }

    setMessages((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { message: message, user: { id: userid } },
      ],
    }));

    socket?.emit("sendMessage", {
      conversationId: conversationId,
      senderId: userid,
      message: message,
      receiverId: messages?.receiver?.receiverId,
    });

    try {
      const res = await fetch(
        "http://localhost:5000/api/message/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversationId,
            senderId: userid,
            message: message,
          }),
        }
      );

      if (res.status === 200) {
        setMessage("");
      } else {
        console.error("Failed to send message to the API");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startAudioCall = async (receiverId) => {
    alert("Audio Called");

    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setStream(userMedia);

      console.log("User Media", userMedia);

      const newPeer = new Peer({
        initiator: true,
        stream: userMedia,
        trickle: false,
      });

      newPeer.on("signal", (data) => {
        console.log(data);
        socket.emit("sendOfferSignal", {
          signalData: data,
          receiverId: receiverId,
          isAudioCall: true,
        });
      });

      newPeer.on("stream", (remoteStream) => {
        console.log("Stream received:", remoteStream);
        const audioElement = new Audio();
        audioElement.srcObject = remoteStream;
        audioElement.play();
      });

      newPeer.on("error", (error) => {
        console.error("Peer error:", error);
      });

      console.log(newPeer);

      setPeer(newPeer);
      setIsCalling(true);

      navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
          console.log(device);
        });
      });
    } catch (error) {
      console.error("Error starting audio call:", error);
    }
  };

  const endCall = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setCallAccepted(false);

    stream.getTracks().forEach((track) => track.stop());
    peer.destroy();
    setIsCalling(false);
  };

  const showSidebarMenu = () => {
    setShowMenu(!showMenu);
  };

  const showAllGroups = () => {
    setShowGroup(!showGroup);
  };

  const isUserOnline = (userId) => {
    // return activeUsers.find((user)=>user.userId ===  userId );
    return activeUsers.some((user) => user.userId === userId);
  };

  console.log("Call Accepted : " + callAccepted);
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
              <a style={{ textDecoration: "none" }}
                href="/message">
                <TextsmsIcon fontSize="medium" className="icon1" />
              </a>
            </div>
            <div className="item2">
              <a
                style={{ textDecoration: "none" }}
                href="/groupmessage"
              >
                <PeopleRoundedIcon fontSize="medium" className="icon2" />
              </a>
            </div>
            <div className="item3">
              {/* <CallRoundedIcon fontSize="medium" className="icon3" /> */}
              <CallRoundedIcon fontSize="medium" className="icon3" />
            </div>
            <hr></hr>
            <div className="item4">
              <SettingsRoundedIcon fontSize="medium" className="icon4" />
            </div>
          </div>
        </div>
      </div>

      {/* left - activity bar */}

      {showMenu ? (
        <div className="showFullMenu">
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
      ) : (
        <div className="lft-menu">
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
      )}
      {/* delete this maybe */}
      <div className="left-menu">
        <div className="top-part">
          <div className="top-part-opt">
            <h1>Messages</h1>
            <GroupsIcon className="group-icon" onClick={showAllGroups} />
          </div>
          {showGroup ? (
            <div className="showAllGroups">
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
                        <div className="groupHeading">
                          <h3>Your Groups</h3>
                          <div className="groups">
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
            </div>
          ) : (
            <div className="RightPopUpDefault"></div>
          )}
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
                <div className="backIcon">
                  <ArrowBackIosIcon onClick={showSidebarMenu} />
                </div>
                <div className="user-pic">
                  <img src={image} alt=""></img>
                </div>
                <div className="user-info">
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
                <CallRoundedIcon
                  onClick={handleCallClick}
                  className="right-part-icon"
                />
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
                  if (id === userid) {
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
              <div className="senders-photo">
                <img
                  src="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg?w=900&t=st=1694330025~exp=1694330625~hmac=9802cf2d74a2d37bc59fd6a722d7a5cd092f49f544149e7d1aa79d18949276b2"
                  alt=""
                ></img>
              </div>
              <div className="recievers-photo">
                <img
                  src="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg?w=900&t=st=1694330025~exp=1694330625~hmac=9802cf2d74a2d37bc59fd6a722d7a5cd092f49f544149e7d1aa79d18949276b2"
                  alt=""
                ></img>
              </div>
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

      {/* {isCallActive &&   (
        <CallUI
          caller={activeConversation} // Pass the active conversation data as the caller
          onAccept={() => {
            // Implement the logic to accept the call
          }}
          onReject={() => {
            // Implement the logic to reject the call
          }}
          onEndCall={() => {
            // Implement the logic to end the call
            // This function should stop the audio call and set isCallActive to false
          }}
          isCalling={true} // You can pass the call status to the CallUI component
        />
      )}

      {incomingCall && !callAccepted  && parsedId != activeConversation && (
        // <div className="incoming-call">
        //   <p>Incoming Call from User {incomingCall.callerId}</p>
        //   <button onClick={acceptCall}>Accept</button>
        //   <button onClick={rejectCall}>Reject</button>
        // </div>
        console.log("activeConversation"),
        console.log(activeConversation.receiverId),
        <CallUI
        caller={activeConversation} // Pass the active conversation data as the caller
        onAccept={acceptCall}
        onReject={rejectCall}
        onEndCall={endCall}
        isCalling={false} // You can pass the call status to the CallUI component
      />
      )} */}
      {isCallActive ? (
        <CallUI
          caller={activeConversation}
          onAccept={() => {
            // Implement the logic to accept the call
          }}
          onReject={() => {
            // Implement the logic to reject the call
          }}
          onEndCall={() => {
            // Implement the logic to end the call
            // This function should stop the audio call and set isCallActive to false
          }}
          isCalling={true}
        />
      ) : incomingCall &&
        !callAccepted &&
        userid !== activeConversation.receiverId ? (
        <CallUI
          caller={activeConversation}
          onAccept={acceptCall}
          onReject={rejectCall}
          onEndCall={endCall}
          isCalling={false}
        />
      ) : null}
    </div>
  );
};