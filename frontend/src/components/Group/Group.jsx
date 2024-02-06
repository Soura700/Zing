import React, { useEffect, useRef } from "react";
import image from "../../assets/jd-chow-gutlccGLXKI-unsplash.jpg";
import SearchIcon from "@mui/icons-material/Search";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

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
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";
import { Link, useNavigate } from "react-router-dom";
import "./group.css";
import axios from "axios";

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
  const [groupId, setGroupId] = useState(null);
  const [activeConversations, setActiveConversations] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [zIndex, setZIndex] = useState(999);
  const [showMenu, setShowMenu] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [additionalDivOpen, setAdditionalDivOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMembersLenght, setGroupMembersLenght] = useState(null);
  const [searchSuggestionResult, setSearchSuggestionResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  var msg = "";
  //25 Sep 2023 code
  const [Image, setImage] = useState("");

  const [clicked, setClicked] = useState(true);
  const navigate = useNavigate();
  const additionalDivRef = useRef(null);
  /* code for search popup modal */

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        additionalDivRef.current &&
        !additionalDivRef.current.contains(event.target)
      ) {
        setAdditionalDivOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to toggle the additional div
  const toggleAdditionalDiv = () => {
    setAdditionalDivOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the popup if clicked outside of it
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const popupRef = useRef(null);

  // const togglePopup = () => {
  //   setShowPopup(!showPopup);
  // };
  const togglePopup = () => {
    if (!showPopup) {
      // If popup is not already open, open it
      setShowPopup(true);
    }
  };

  const handleArrowButtonClick = () => {
    setClicked((prevClicked) => {
      // Toggle the previous state
      if (prevClicked) {
        // If the user is going back to the /message page, trigger a reload
        navigate("/groupmessage");
        window.location.reload();
      }
      return !prevClicked;
    });
  };
  const customStyle = { zIndex: !clicked ? 0 : setZIndex };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 472px)");
    const showSidebarMenu = () => {
      setShowMenu(!showMenu);
      setZIndex(99);
    };
    const handleMediaQueryChange = (mediaQuery) => {
      // Update z-index based on media query result
      setZIndex(mediaQuery.matches ? 9999 : 999);
    };

    // Initial check for media query
    handleMediaQueryChange(mediaQuery);

    // Listen for changes in media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Clean up the event listener
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming calls
      socket.on("incomingGroupCallAlert", (data) => {
        setIncomingCall(true);
      });
    }
  }, [socket]);

  // Function to toggle the Create Group modal
  const toggleCreateGroupModal = () => {
    setShowCreateGroupModal(!showCreateGroupModal);
  };

  // Add this function to your React component
  const searchUserSuggestions = async (searchValue) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/conversation/get/conversation/" +
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
    } else {
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
              groupName: groupName,
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

  const getConversationId = async (group_id) => {
    try {
      // Make an API request to fetch group messages based on groupId
      const res = await fetch(
        `http://localhost:5000/api/conversation/get_group_id/conversation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            group_id: group_id,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        // Now you can set the updated data in your state
        setConversationId(data._id);
      } else {
        console.error("No Conversation Found");
      }
    } catch (error) {
      console.error("Error fetching conversation for the group:", error);
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
  async function SendImage(e) {
    var inputElement = document.getElementById("imageInput");
    var file = inputElement.files[0];
    console.log("yep");

    if (!file.type.match("image.*")) {
      alert("Please select an image only");
    } else {
      try {
        const options = {
          maxSizeMB: 0.1, // Set the desired maximum size of the compressed image in megabytes
          maxWidthOrHeight: 800, // Set the maximum width or height of the compressed image
          useWebWorker: true, // Use Web Workers for faster compression (if available)
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          function () {
            // alert(reader.result);
            setImage(reader.result);
          },
          false
        );

        if (compressedFile) {
          reader.readAsDataURL(compressedFile);
        }
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  }

  console.log(Image);

  async function uploadImage() {
    const messageIndex = 0;
    alert("hi");
    setGroupMessages((prev) => [
      ...prev,
      { message: Image, user: { id: parsedId } }, // Ensure each message has a user field
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
        message: Image,
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
      msg = <img src="${Image}" alt="" />;
      return msg;
    }
  }

  const handleMessageClick = () => {
    socket.emit("initiateGroupCall", {
      groupId: groupId,
      callerId: parsedId,
    });

    const url = `http://localhost:5000/${groupId}`;
    window.location.href = url;
  };

  const handleAcceptButtonClick = () => {
    const url = `http://localhost:5000/${groupId}`;
    window.location.href = url;
  };

  const getGroupMembers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/group/get_group_members?groupId=65bfaa29eeef4bcdeb846f91",
        {
          params: { query: groupId }, // Pass the search query as a parameter
        }
      );

      if (res.status === 200) {
        console.log(res.data.length);
        // Clear the input field after sending
        setGroupMembersLenght(res.data.length - 1);
        setGroupMembers(res.data);
      } else {
        console.error("Failed to get group members to the API");
        // Handle error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setSearchQuery(inputValue); // Update the query state as the user types

    try {
      // Make an AJAX request to fetch search suggestions from the backend
      const response = await axios.get(
        "http://localhost:5000/api/group/search-suggestions",
        {
          params: { query: searchQuery }, // Pass the search query as a parameter
        }
      );
      // Update the suggestions state with the response data
      setSearchSuggestionResult(response.data);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  // Render the rest of your component based on the authentication status
  return (
    <div style={styles} className="grpOuterDiv">
      <div style={styles} className="container grpOuterDiv">
        {/* left-options bar */}

        <div className="grp-left-opt-menu">
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
              {/* <div className="item3">
                
                <CallRoundedIcon fontSize="medium" className="icon3" />
              </div> */}
              <hr></hr>
              <div className="item4">
                <SettingsRoundedIcon fontSize="medium" className="icon4" />
              </div>
            </div>
          </div>
        </div>

        {/* left - activity bar */}
        <div className="left-group-menu">
          <div className="grp-top-part">
            <div className="grp-top-part-opt">
              <h1>Groups</h1>
              {/* <GroupsIcon /> */}
              <Link to="/">
                <HomeRoundedIcon />
              </Link>
            </div>
            <div className="grp-top-search-bar">
              <input
                type="text"
                name="search-bar"
                placeholder="Search"
                onChange={handleInputChange}
                onClick={togglePopup}
              />
              <div className="search-btn">
                <SearchIcon className="search-icon" />
              </div>
              {showPopup && (
                <div className="grp-popup" ref={popupRef}>
                  <h2>Search results</h2>
                  <div className="popupResultsContainer">
                    {searchSuggestionResult.length === 0 ? (
                      <p>No search results found</p>
                    ) : (
                      searchSuggestionResult.map((suggestion, index) => (
                        <div className="popupUser">
                          <img
                            src="C:\Users\anura\OneDrive\Desktop\social media cloned\SocialMedia\frontend\src\assets\jd-chow-gutlccGLXKI-unsplash.jpg"
                            alt=""
                          />
                          <p
                            onClick={() => {
                              alert("Hello");
                              setActiveConversations(true);
                              setGroupId(suggestion._id);
                              setGroupName(suggestion.groupName);
                              getGroupMembers();
                              getConversationId(suggestion._id);
                              handleGroupClick(suggestion._id);
                              setShowPopup(false);
                            }}
                          >
                            {suggestion.groupName}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="CreateGrpIcon" onClick={toggleCreateGroupModal}>
              <div className="createGroupDiv">
                <GroupAddRoundedIcon />
                Create a new group
              </div>
            </button>
            <div className="grp-mid-part">
              <span>All Groups</span>
              {groups.map((group, user, index) => {
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
                        setActiveConversations(true);
                        setGroupId(group._id);
                        // alert(group.groupName);
                        setGroupName(group.groupName);
                        getGroupMembers();
                        getConversationId(group._id);
                        handleGroupClick(group._id);
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
              })}
            </div>
          </div>
        </div>

        {/* main chat section */}

        {activeConversations ? (
          <div className="grp-main-chat-section">
            <>
              <div className="info">
                <div className="left-part">
                  <div className="backIcon">
                    <ArrowBackIosIcon onClick={handleArrowButtonClick} />
                  </div>
                  <div className="user-pic">
                    <img src={image} alt=""></img>
                  </div>
                  <div className="user-info">
                    <div className="left-info">
                      <h1>{groupName}</h1>
                      <p
                        onClick={() => {
                          toggleAdditionalDiv();
                          getGroupMembers();
                        }}
                      >
                        {`You and ${groupMembersLenght} others`}
                      </p>
                      {/* Add the user names of the group  */}
                    </div>
                  </div>
                </div>
                <div className="right-part">
                  {/* {inCall ? (
                    <GroupVideoCall groupId={groupId} />
                  ) : (
                    <CallRoundedIcon
                      className="right-part-icon"
                      onClick={handleMessageClick}
                    />
                  )} */}
                  <CallRoundedIcon
                    className="right-part-icon"
                    onClick={handleMessageClick}
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
                          {/* <img src={`http://localhost:5000/${profileImg}`} alt=""></img>
                        <h1>{activeConversations.username}</h1> */}
                        </div>
                        <div className="bottom">
                          <div className="userOpt1">
                            <BlockIcon className="bottom-icon" />
                            <h2>Report</h2>
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

                {additionalDivOpen && (
                  <div
                    ref={additionalDivRef}
                    className="additional-div"
                    style={{ zIndex: 999 }}
                  >
                    <h2>Group Members</h2>
                    {groupMembers.map((groupMember, index) => {
                      console.log("Group Member");
                      console.log(groupMember);
                      return (
                        <div className="groupMembersDiv">
                          <div className="groupMembers">
                            <a
                              href="/message"
                              style={{ "text-decoration": " none" }}
                            >
                              <img
                                src={`http://localhost:5000/${groupMember.user.profileImg}`}
                                alt="User"
                              />
                            </a>
                            <a href="/message">
                              <p>{groupMember.user.username}</p>
                            </a>
                          </div>
                        </div>
                      );
                    })}

                    {/* <div className="groupMembersDiv">
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>
                        <div className="groupMembers">
                          <img src="" alt="" />
                          <p>John Doe</p>
                        </div>

                      </div> */}
                  </div>
                )}
              </div>
              <div className="grp-inner-container">
                {groupMessages.map(({ message, user: { id } = {} }, index) => {
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
                        <img src={message} alt="Sent Image" />
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
              </div>

              <div className="grp-chat-bottom">
                <div className="grp-chat-input">
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
                  {/* <LocationOnIcon className="chat-btn" />
                  <MicNoneIcon className="chat-btn" /> */}
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
                      <ArrowUpwardRoundedIcon className="submit-btn" />
                    </button>
                  )}
                </div>
                {incomingCall && (
                  <button onClick={handleAcceptButtonClick}>Accept</button>
                )}
              </div>
            </>
            {/* )} */}
          </div>
        ) : (
          <div
            className="no-conversations"
            // style={{ textAlign: "center", marginTop: "10px" }}
          >
            <span>
              No Messages to show. Click on the Groups to see the messages
            </span>
          </div>
        )}

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

              <div className="add-members">
                <h3>Add members</h3>
                <div className="add-members-input">
                  <input
                    type="text"
                    name="search-bar"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search"
                    className="add-members-input"
                  />
                  {/* <div className="search-btn">
                <SearchIcon
                  className="search-icon"
                  onClick={handleSearchIconClick}
                />
              </div> */}
                  <div className="search-btn">
                    <SearchIcon
                      className="search-icon"
                      onClick={handleSearchIconClick}
                    />
                  </div>
                </div>
              </div>
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
    </div>
  );
};
