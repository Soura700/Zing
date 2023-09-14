import React, { useEffect } from "react";
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
import "./group.css"

export const Group = () => {
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [toggle, setToggle] = useState(false);


  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [activeUsers, setActiveUsers] = useState([]);


  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]); // You need to fetch and populate this list
  const [searchResult , setSearchResult] = useState([]);
  const [selectedUsers , setSelectedUsers] = useState([]);


  console.log(selectedUsers);

  

  // Function to toggle the Create Group modal
  const toggleCreateGroupModal = () => {
    setShowCreateGroupModal(!showCreateGroupModal);
  };

  // Function to handle search input change
  // const handleSearchInputChange = (e) => {
  //   setSearchValue(e.target.value);
  // };
  

  // Add this function to your React component
const searchUserSuggestions = async (searchValue) => {
  try {
    const res = await fetch(`http://localhost:5000/api/conversation/get/conversation/`+searchValue);
    // console
    if (res.ok) {
      const data = await res.json();
      // console.log(data)
      // Update the state with the fetched user name suggestions
      setSearchResult(data); // Assuming `setSearchResult` is a state updater function
    } else {
      console.error('Failed to fetch user name suggestions');
    }
  } catch (error) {
    console.error('Error fetching user name suggestions:', error);
  }
};


// console.log(searchResult);

const handleSearchIconClick = () => {
  // Call the searchUserSuggestions function with the current searchValue
  searchUserSuggestions(searchValue);
};

// Modify your handleSearchInputChange function to call the searchUserSuggestions function


const handleSearchInputChange = (e) => {
  const value = e.target.value;
  setSearchValue(value);
  // Call the searchUserSuggestions function with the updated search value
  searchUserSuggestions(value);
};





  // Filter users based on search input
  const filteredUsers = availableUsers.filter((user) =>
    user.username.toLowerCase().includes(searchValue.toLowerCase())
  );


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
        setActiveUsers(activeUsers);
      });
      socket.on("getMessage", (data) => {
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


  const isUserOnline = (userId) => {
    // return activeUsers.find((user)=>user.userId ===  userId );
    return activeUsers.some((user) => user.userId === userId);
  };

  


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

  // Render loading indicator if still loading authentication data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleGroup = (userToAdd) => {
    const isUserAlreadyAdded = selectedUsers.some((user) => user.id === userToAdd.id);

    if (isUserAlreadyAdded) {
      // User is already added, show an alert or handle it as needed
      alert('User is already added to the group.');
    } else {
      // User is not in the selectedUsers array, add them
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };


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
            <button onClick={toggleCreateGroupModal}>Create Group</button>
            {
              // conversations.length>0?
              conversations.map((conversation, user, index) => {


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
                  {conversations.map((conversation, user, index) => {
                    
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
                  })}
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

      {showCreateGroupModal && (
        // console.log(searchResult),
        <div className="create-group-modal">
          <div className="modal-content">
            <h2>Create Group</h2>
            <div className="top-search-bar">
              <input
                type="text"
                name="search-bar"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
              />
              <div className="search-btn">
                <SearchIcon className="search-icon" onClick={handleSearchIconClick} />
              </div>
            </div>
            <div className="user-list">
              {/* Render the filtered users here */}
              {/* {
                searchResult.map((user)=>{
                  // <div>{user.username}</div>
                  console.log(user.username);
                  <div>{user.username}</div>
                })
              } */}
              {searchResult.map((user) => (
                <div key={user.id} className="user-item" onClick={handleGroup(user)}>
                  <label htmlFor={`user-${user.id}`}>{user.username}</label>
                </div>
              ))}
            </div>
            <button onClick={toggleCreateGroupModal}>Create</button>
          </div>
        </div>
      )}

    </div>
  );
};
