import React, { useEffect } from "react";
import "./leftbar2.css";
import image from "../../assets/jd-chow-gutlccGLXKI-unsplash.jpg";
import SearchIcon from "@mui/icons-material/Search";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import GroupsIcon from "@mui/icons-material/Groups";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress from Material-UI
import { useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../Contexts/authContext";
import Peer from "simple-peer";
import CallUI from "../../components/CallUi/CallUi";
import ringtone from "../../assets/Chaleya.mp3";
import IncomingCallUi from "../IncomingCallUi/IncomingCallUi";
import ChatUI from "../Chat-main/ChatUi";

export const Let= () => {
  const location = useLocation();
  var { userId, userName, clicked } = location.state || {};
  const parsedUserId = parseInt(userId);
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [activeUsers, setActiveUsers] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [checkConversation, setCheckConversation] = useState(null);
  const [showGroup, setShowGroup] = useState(false);
  const parsedId = parseInt(id);
  const [showMessageBox, setShowMessageBox] = useState(false);
  //this edited1
  const [showMenu, setShowMenu] = useState(false);
  const showSidebarMenu = () => {
    setShowMenu(!showMenu);
  };
  const showAllGroups = () => {
    setShowGroup(!showGroup);
  };


  useEffect(() => {
    const socket = io("http://localhost:5500");
    setSocket(io("http://localhost:5500"));
    // Cleanup: Disconnect the socket when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    //19/1/2024
    if (clicked) {
      let isMounted = true;
      setShowMessageBox(true);
      const checkExistenceOfConversation = async () => {
        console.log("ParsedId");
        console.log(parsedId);
        try {
          const userRes = await fetch(
            "http://localhost:5000/api/conversation/getConversation_by_sender_receiverId",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                senderId: parsedId,
                receiverId: parsedUserId,
              }),
            }
          );

          if (!isMounted) {
            // Component unmounted, don't proceed
            return;
          }
          const userDetails = await userRes.json();
          if (userDetails.length === 0) {
            try {
              const createRes = await fetch(
                "http://localhost:5000/api/conversation/create/conversation",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    senderId: parsedId,
                    receiverId: parsedUserId,
                  }),
                }
              );
              const userRes = await fetch(
                "http://localhost:5000/api/conversation/getConversation_by_sender_receiverId",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    senderId: parsedId,
                    receiverId: parsedUserId,
                  }),
                }
              );
              const userDetails = await userRes.json();

              fetchMessages(userDetails[0].conversationId, userDetails[0].user);

              if (!isMounted) {
                // Component unmounted, don't proceed
                return;
              }
              const createdUserDetails = await createRes.json();
            } catch (createError) {
              console.error("Error creating conversation:", createError);
            }
          } else if (userDetails[0] && userDetails[0].conversationId) {
            fetchMessages(userDetails[0].conversationId, userDetails[0].user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      // Call the function when the component mounts
      checkExistenceOfConversation();
      // Cleanup function to mark the component as unmounted
      return () => {
        isMounted = false;
      };
    }
  }, [parsedId, isLoggedIn]);

  // ... (rest of your component code)



  const styles = {
    "*": {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
  };
  useEffect(() => {
    checkAuthentication().then(() => {
      setIsLoading(false); // Mark loading as complete when authentication data is available
    });
  }, [checkAuthentication]);

  const handleToggle = () => {
    alert("Clicked");
    setToggle(!toggle);
  };
  useEffect(() => {
    // Only perform socket-related operations if the user is authenticated
    if (isLoggedIn && socket) {
      socket.emit("addUser", parsedId);
      socket.on("getUser", (activeUsers) => {
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
  }, [socket, parsedId, isLoggedIn]);
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
        console.log("All conversationssssssss");
        console.log(data);
        // Iterate through each conversation and fetch user details
        const updatedConversations = await Promise.all(
          data.map(async (conversation) => {
            const userRes = await fetch(
              `http://localhost:5000/api/auth/${conversation.user.receiverId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const userDetails = await userRes.json();

            // Update the conversation with user details
            return {
              ...conversation,
              user: {
                ...conversation.user,
                profileImg: userDetails[0]?.profileImg,
              },
            };
          })
        );
        setConversations(updatedConversations);
        // setConversations(data);
      };
      fetchData();
    }
  }, [isLoggedIn]);
  const fetchMessages = async (id, user) => {
    if (isLoggedIn) {
      // Fetch user image along with other conversation details
      const userRes = await fetch(
        `http://localhost:5000/api/auth/${user.receiverId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userData = await userRes.json();
      console.log("Profile Imageeeeeeeeeeeeeeeeeeeeee");
      const res = await fetch(
        "http://localhost:5000/api/message/get_messages/" + id
      );
      const resJson = await res.json();
      setMessages({
        messages: resJson,
        receiver: { ...user, profileImg: userData[0].profileImg },
        conversationId: id,
      });
      // setConversationId(id);
      setActiveConversation(user);
    }
  };
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
  if (isLoading || socket === null) {
    return <CircularProgress />; // Use CircularProgress for a loading spinner
  }
  // Render the rest of your component based on the authentication status
  return (
    <div className="leftbar2">
      <div style={styles} className="container">
        {/* left-options bar */}

        <div className="left-opt-menu">
          <div className="container">
            <div className="items">
              <div className="profile-img">
                <img src={image} alt="" />
              </div>
              <div className="item1">
                <a style={{ textDecoration: "none" }} href="/message">
                  <TextsmsIcon fontSize="medium" className="icon1" />
                </a>
              </div>
              <div className="item2">
                <a style={{ textDecoration: "none" }} href="/groupmessage">
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

                    console.log("Helloooooooo Bro........");
                    alert(conversation);

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
                              <h2 onClick={() => alert("Hello")}>
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
                              <h2 onClick={() => alert("Hello2")}>
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
                                  <h2 onClick={() => alert("Hello3")}>
                                    {/* {conversation.conversationUserData[0].username} */}
                                    {conversation.user.username}
                                  </h2>
                                  <p className="activity">
                                    Lorem, ipsum dolor.
                                  </p>
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
                  console.log(
                    "HelllllllllllllllllllllllllByeeeeeeeeeeeeeeeeeeee"
                  );
                  console.log(conversation);
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
                            src={`http://localhost:5000/${conversation.user.profileImg}`}
                            alt="User"
                            onClick={() =>
                              fetchMessages(
                                conversation.conversationId,
                                conversation.user
                              )
                            }
                          />
                          <div className="left-info">
                            <h2 onClick={() => alert("Hello4")}>
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
        {activeConversation ? (
          <ChatUI
            showSidebarMenu={() => setShowMenu(!showMenu)}
            handleToggle={handleToggle}
            toggle={toggle}
            activeConversation={activeConversation}
            messages={messages}
            parsedId={parsedId}
            setMessage={setMessage}
            sendMessage={sendMessage}
            isUserOnline={isUserOnline}
            activeUsers={activeUsers}
            profileImg={messages.receiver?.profileImg}
            showMessageBox={true}
          />
        ) : (
          <div
            className="no-conversations"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            No Messages to show. Click on the conversation to see the messages
          </div>
        )}
      </div>
    </div>
  );
};
