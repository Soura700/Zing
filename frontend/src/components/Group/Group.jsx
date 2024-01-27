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
import GroupsIcon from "@mui/icons-material/Groups";
import { useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./group.css";

export const Group = () => {
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [activeUsers, setActiveUsers] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [groupValue, setGroupValue] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]); // You need to fetch and populate this list
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserNames, setSelectedUserNames] = useState([]);
  const [groupChat, setGroupChat] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  var msg = "";

  //25 Sep 2023 code
  const [Image, setImage] = useState("");
  const [showImg, setShowImg] = useState(false);
  // Function to toggle the Create Group modal
  const toggleCreateGroupModal = () => {
    setShowCreateGroupModal(!showCreateGroupModal);
  };
  const showFullImg = () => {
    setShowImg(!showImg);
  };
  const closeImg = () => {
    // Set showImg to false to hide the image
    setShowImg(false);
  };
  // Add this function to your React component
  const searchUserSuggestions = async (searchValue) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/conversation/get/conversation/` +
          searchValue,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parsedId,
          }),
        }
      );
      // console
      if (res.ok) {
        const data = await res.json();
        // Update the state with the fetched user name suggestions
        setSearchResult(data);
      } else if (res.status === 404) {
        toast.error("No conversations found");
      } else {
        console.error("Failed to fetch user name suggestions");
      }
    } catch (error) {
      console.error("Error fetching user name suggestions:", error);
    }
  };

  console.log("Search Resukt.........");
  console.log(searchResult);

  const handleSearchIconClick = () => {
    // Call the searchUserSuggestions function with the current searchValue
    searchUserSuggestions(searchValue);
    setSearchValue("");
  };

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

  const handleDelete = (userToRemove) => {
    console.log(userToRemove);

    // const updatedUserNames = selectedUserNames.filter(
    //   (user)=>user !== userToRemove
    // )

    const updatedUserNames = selectedUserNames.filter(
      (user) => user !== userToRemove
    );

    console.log(updatedUserNames);

    setSelectedUserNames(updatedUserNames);
  };

  //
  useEffect(() => {
    // Only perform socket-related operations if the user is authenticated
    if (isLoggedIn) {
      socket.on("groupMessage", (data) => {
        console.log(data);
        setGroupMessages((prev) => [
          ...prev,
          { message: data.message, user: data.user }, // Ensure each message has a user field
        ]);
      });
    }
  }, [socket, parsedId, isLoggedIn]);

  const sendMessage = async () => {
    const messageIndex = 0;

    setGroupMessages((prev) => [
      ...prev,
      { message: message, user: { id: parsedId } }, // Ensure each message has a user field
    ]);

    if (
      groupMessages.length > 0 &&
      groupMessages[messageIndex].conversationId
    ) {
      const conversationId = groupMessages[messageIndex].conversationId;
      const groupId = groupMessages[messageIndex].groupId;

      socket?.emit("sendGroupMessage", {
        senderId: parsedId,
        message: message,
        conversationId: conversationId,
        group_id: groupId,
      });

      try {
        const res = await fetch(
          "http://localhost:5000/api/groupmessage/group/message_create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              conversationId: conversationId,
              senderId: parsedId,
              message: message,
              group_id: groupId,
            }),
          }
        );

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
    }
  };

  const createGroup = async () => {
    try {
      // Create an array of member IDs including the logged-in user
      const memberIds = [parsedId, ...selectedUsers.map((user) => user.userId)];

      console.log(groupValue);
      console.log(typeof groupValue);

      const res = await fetch("http://localhost:5000/api/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          groupName: groupValue,
          admin: id, // Set the logged-in user as the admin
          members: memberIds, // Add members including the logged-in user
        }),
      });

      const response = await res.json();
      console.log(response);
      setGroupChat(response.groupName);

      const createConversation = await fetch(
        "http://localhost:5000/api/conversation/create/group/conversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            groupName: response.groupName,
            admin: response.groupAdmin, // Set the logged-in user as the admin
            memberIds: memberIds, // Add members including the logged-in user
          }),
        }
      );

      const conversationResponse = await createConversation.json();

      if (res.status === 200) {
        // Clear any selected users and group name input
        setSelectedUsers([]);
        setGroupValue("");

        // Close the create group modal
        toggleCreateGroupModal();

        // Optionally, you can update your local state or perform other actions if needed.
      } else {
        console.error("Failed to create group");
        // Handle the error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch(
        "http://localhost:5000/api/group/groups/" + parsedId
      );
      const data = await res.json();
      setGroups(data);
    };
    fetchGroups();
  }, [parsedId]);

  // Render loading indicator if still loading authentication data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleGroup = (userToAdd) => {
    const isUserAlreadyAdded = selectedUsers.some(
      (user) => user.id === userToAdd.id
    );

    if (isUserAlreadyAdded) {
      // User is already added, show an alert or handle it as needed
      alert("User is already added to the group.");
    } else {
      // User is not in the selectedUsers array, add them
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };

  const addUserToGroup = (user) => {
    setSearchResult([]);
    // Add the user to the selectedUsers state
    const isUserAlreadySelected = selectedUsers.some(
      (selectedUsers) => selectedUsers.userId === user.userId
    );
    if (!isUserAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
      // Add the username to the selectedUserNames state
      setSelectedUserNames([...selectedUserNames, user.username]);
    }
  };

  const handleGroupClick = async (groupId) => {
    alert("Hello");
    socket.emit(groupId, parsedId);
    socket.emit("join chat", groupId);
    try {
      // Make an API request to fetch group messages based on groupId
      const res = await fetch(
        `http://localhost:5000/api/groupmessage/get_group_messages/${groupId}`
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Data");
        console.log(data);

        // Create a new array with updated conversationId for each item
        const updatedData = data.map((item) => ({
          message: item.message,
          user: item.user,
          groupId: groupId,
          conversationId: item.conversationId, // Assuming conversationId is a property in each item
        }));

        // Now you can set the updated data in your state
        setGroupMessages(updatedData);
      } else {
        console.error("Failed to fetch group messages");
      }
    } catch (error) {
      console.error("Error fetching group messages:", error);
    }
  };

  console.log(groupMessages);

  //function for selecting only image files as media attachment in chat

  function chooseImage() {
    document.getElementById("imageInput").click();
  }
  function SendImage(e) {
    var inputElement = document.getElementById("imageInput");
    var file = inputElement.files[0];
    console.log("yep");

    if (!file.type.match("image.*")) {
      alert("Please select  image only");
    } else {
      var reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          // alert(reader.result);
          setImage(reader.result);
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  console.log(Image);

  async function uploadImage() {
    const messageIndex = 0;
    alert("hi");
    setGroupMessages((prev) => [
      ...prev,
      { message: message, user: { id: parsedId } }, // Ensure each message has a user field
    ]);

    if (
      groupMessages.length > 0 &&
      groupMessages[messageIndex].conversationId
    ) {
      alert("Entered");

      const conversationId = groupMessages[messageIndex].conversationId;
      const groupId = groupMessages[messageIndex].groupId;

      socket?.emit("sendGroupMessage", {
        senderId: parsedId,
        message: message,
        conversationId: conversationId,
        group_id: groupId,
      });
      try {
        const res = await fetch(
          "http://localhost:5000/api/groupmessage/group/message_create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              conversationId: conversationId,
              senderId: parsedId,
              message: Image,
              group_id: groupId,
            }),
          }
        );

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
    }
  }

  function loadChatImg() {
    var msg = "";
    if (Image.indexOf("base64") !== -1) {
      msg = `<img src='${Image}' alt="" />`;
      return msg;
    }
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
      <div className="left-menu">
        <div className="top-part">
          <div className="top-part-opt">
            <h1>Messages</h1>
            <GroupsIcon />
          </div>
          <div className="top-search-bar">
            <input type="text" name="search-bar" placeholder="Search" />
            <div className="search-btn">
              <SearchIcon className="search-icon" />
            </div>
          </div>
          <div className="mid-part">
            <span>Pinned Messages</span>
            {/* <button onClick={toggleCreateGroupModal}>Create Group</button> */}
            <button className="CreateGrpIcon" onClick={toggleCreateGroupModal}>
              Create Group
            </button>
            {
              // conversations.length>0?
              groups.map((group, user, index) => {
                if (groups.length > 0) {
                  console.log(group._id);
                  console.log(group.groupName);
                  return (
                    <div
                      className="mid-text"
                      key={index}
                      // onClick={() =>
                      //   fetchMessages(
                      //     conversation.conversationId,
                      //     conversation.user
                      //   )
                      // }

                      onClick={() => {
                        alert("Hello");
                        handleGroupClick(group._id);
                        setGroupName(group.groupName);
                      }}
                    >
                      <div className="left">
                        <img
                          src={image}
                          alt=""
                          // onClick={() =>
                          //   fetchMessages(
                          //     group.conversationId,
                          //     conversation.user
                          //   )
                          // }
                        />
                        <div className="left-info">
                          <h2 onClick={() => console.log("Hello")}>
                            {/* {conversation.conversationUserData[0].username} */}
                            {group.groupName}
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

            <div className="AllUserChat">
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
      </div>

      {/* main chat section */}

      <div className="main-chat-section">
        {/* {groupMessages?.message?.length > 0 ? ( */}
        {groupMessages.length > 0 ? (
          (console.log(groupMessages),
          (
            <>
              <div className="info">
                <div className="left-part">
                  <div className="user-pic">
                    <img src={image} alt=""></img>
                  </div>
                  <div className="user-info">
                    <div className="left-info">
                      <h1>{groupName}</h1>
                      <p className="otherMembers">You and 2 Others</p>
                      {/* Add the user names of the group  */}
                    </div>
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
                {groupMessages.map(({ message, user: { id } = {} }, index) => {
                  console.log(groupMessages);
                  // Check if the message starts with "data:image/"
                  if (message.startsWith("data:image/")) {
                    // If it's an image, render it as an img element
                    return (
                      <div
                        className={
                          id === parsedId ? "outgoing-msg" : "incoming-msg"
                        }
                        key={index}
                      >
                        <img
                          src={message}
                          alt="Sent Image"
                          className="incomingMsgImg"
                          onClick={showFullImg}
                        />
                        {showImg ? (
                          <div className="chatImgShow">
                            <img src={message} alt="Sent Image" />
                              <CloseIcon className="closeIcon" onClick={closeImg}/>
                          </div>
                        ) : (
                          <div className="chatImgClose"></div>
                        )}
                      </div>
                    );
                  } else {
                    // If it's not an image, render it as a text message
                    return (
                      <div
                        className={
                          id === parsedId ? "outgoing-msg" : "incoming-msg"
                        }
                        key={index}
                      >
                        {message}
                      </div>
                    );
                  }
                })}
                {/* // Inside your component's render function */}
                {/* <div className="senders-photo">
                  {Image && Image.startsWith("data:image/") ? (
                    <img src={Image} alt="" />
                  ) : null}
                </div>
                <div className="recievers-photo">
                  {Image && Image.startsWith("data:image/") ? (
                    <img src={Image} alt="" />
                  ) : null}
                </div> */}
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
                    onChange={SendImage}
                  />
                  {/* <PhotoSizeSelectActualIcon className="chat-btn" /> */}
                  <label htmlFor="imageInput" onClick={chooseImage}>
                    <PhotoSizeSelectActualIcon className="chat-btn" />
                  </label>
                  <LocationOnIcon className="chat-btn" />
                  <MicNoneIcon className="chat-btn" />
                </div>
                <div className="submit-btn-class">
                  {/* <button onClick={() => sendMessage()}>
                    <TelegramIcon className="submit-btn" />
                  </button> */}
                  {!message && Image ? (
                    <div className="addMembersLabel">
                      {/* Display the selected user names here */}
                      <button onClick={() => uploadImage()}>
                        <TelegramIcon className="submit-btn" />
                      </button>
                      {/* <CloseIcon
                    fontSize="10px"
                    className="membersLabel"
                    onClick={ () =>handleDelete(id)}
                  /> */}
                    </div>
                  ) : (
                    <button onClick={() => sendMessage()}>
                      <TelegramIcon className="submit-btn" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ))
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

            {/* New */}

            <div className="grp-name">
              <h3>Enter group name</h3>
              <input
                type="text"
                placeholder="Enter Group Name"
                // value={searchValue}
                // onChange={handleSearchInputChange}
                value={groupValue}
                onChange={(e) => setGroupValue(e.target.value)}
              />
            </div>
            <h3>Add members</h3>
            <div className="add-members">
              <input
                type="text"
                name="search-bar"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
              />
              <div className="search-btn">
                <SearchIcon
                  className="search-icon"
                  onClick={handleSearchIconClick}
                />
              </div>
            </div>
            {/* <div className="search-btn">
              <SearchIcon
                className="search-icon"
                onClick={handleSearchIconClick}
              />
            </div> */}

            {/* <div className="membersLabel">
              <div className="addMembersLabel">
                <p>Messi</p>
                <CloseIcon fontSize="10px" className="membersLabel" />
              </div>
            </div> */}

            <div className="membersLabel">
              {selectedUserNames.length > 0 ? (
                <div className="addMembersLabel">
                  {/* Display the selected user names here */}
                  {selectedUserNames.map((name, index) => (
                    <>
                      <p key={index} className="membersLabelName">
                        {name}
                      </p>
                      <CloseIcon
                        fontSize="10px"
                        className="membersLabelCloseIcon"
                        onClick={() => handleDelete(name)}
                      />
                    </>
                  ))}
                  {/* <CloseIcon
                    fontSize="10px"
                    className="membersLabel"
                    onClick={ () =>handleDelete(id)}
                  /> */}
                </div>
              ) : null}
            </div>

            <div className="user-list">
              {searchResult.map((user) => (
                <div className="userListContainer">
                  <div className="userLists" key={user.id}>
                    <p>{user.username}</p>
                    <div className="userListIconContainer">
                      <DoneIcon
                        className="userListIconTick"
                        onClick={() => addUserToGroup(user)}
                      />
                      <CloseIcon className="userListIconCross" onClick={""} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="createGrpChatBtn"
              onClick={() => {
                createGroup();
                toggleCreateGroupModal();
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
