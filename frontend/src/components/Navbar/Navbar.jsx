import React, { useEffect, useRef } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CloseIcon from "@mui/icons-material/Close";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";
import { useState } from "react";
import RightBar from "../RightBar/RightBar";
import axios from "axios";
import { useTheme } from "../../Contexts/themeContext";
import Logo from "../../assets/zing_final2.svg";
// Toggler
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import CircularProgress from "@mui/material/CircularProgress"; // Add this line

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WindPower } from "@mui/icons-material";

const Navbar = ({ toggleMenu, user }) => {
  const { theme, toggleTheme } = useTheme();

  const [toggle, setToggle] = useState(false);
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, id: userId, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Setting the loading
  const [friendRequests, setFriendRequests] = useState([]); //Sets the friends requets spreading with the old requests with the new requests in realtime
  const [senderName, setSenderName] = useState(null); //Setting the current / logged user name in the state
  const [username, setUsername] = useState(null); //Setting the current / logged user name in the state
  const [userPhoto, setUserPhoto] = useState(null); //Setting the userprofile image from the database
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0); //It is for unreadnotification (use case : like facebook notification..)
  const [message, setMessage] = useState([]); //This is for the all kind of messages..(example :User A has accepted the friend request e.t.c);
  const parsedID = parseInt(id);
  const [notifMenu, setNotifMenu] = useState(false); //for notif panel
  const notifPanelRef = useRef(null);
  const [deletedAcceptedRequests, setdeletedAcceptedRequests] = useState([]); //Sets the friends requets spreading with the old requests with the new requests in realtime
  const [unreadMessageCount, setunreadMessageCount] = useState(0); //It is for unreadnotification (use case : like facebook notification..)
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState(null);
  const [showRightBar, setShowRightBar] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [query, setQuery] = useState(""); // State to store the search query
  const [suggestions, setSuggestions] = useState([]); // State to store search suggestions
  const searchRef = useRef(null);
  //popup for search modal

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    if (popupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupVisible]);

  // const handleSearchClick = () => {
  //   setPopupVisible(true);
  // };

  useEffect(() => {
    // Event listener to close notifPanel when clicked outside of it
    const handleClickOutside = (event) => {
      if (
        notifPanelRef.current &&
        !notifPanelRef.current.contains(event.target)
      ) {
        setNotifMenu(false);
      }
    };

    // Add event listener when notifMenu is open
    if (notifMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifMenu]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuthentication();
        const userRes = await fetch("http://localhost:5000/api/auth/" + id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const userDetails = await userRes.json();
        setUsername(userDetails[0].username);
        setUserPhoto(userDetails[0].profileImg);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchSenderName = async () => {
      try {
        await checkAuthentication();
        const userRes = await fetch(
          "http://localhost:5000/api/auth/" + parsedID,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const userDetails = await userRes.json();

        if (userDetails && userDetails.length > 0 && userDetails[0]) {
          setSenderName(userDetails[0].username);
          setUserPhoto(userDetails[0].profileImg);
        } else {
          console.error("Invalid or empty user details:", userDetails);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/friend_request/get_friend_requests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: parsedID,
            }),
          }
        );
        const data = await res.json();
        const requestsWithProfileImages = await Promise.all(
          data.map(async (request) => {
            const profile = await fetchProfileImage(request.senderUserId);
            const profileImg = await profile.json();
            return { ...request, profileImg: profileImg[0].profileImg };
          })
        );

        // setFriendRequests(data);
        setFriendRequests(requestsWithProfileImages);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };


    const fetchUnreadNotificationCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/get/get_unread_friend_message/" + parsedID
        );
        const data = await response.json();
        // Assuming data is an array of user objects with a 'name' property
        const userNames = data.map((user) => user.senderName);
        setUnreadNotificationCount(data.length);
        // setUnreadNotificationCount(data.unreadNotificationCount);
      } catch (error) {
        console.error("Error fetching unread notification count:", error);
      }
    };

    // const fetchUnreadMessages = async () => {
    //   try {
    //     const response = await fetch(
    //       "http://localhost:5000/api/get/get_unread_read_message/" + parsedID
    //     );
    //     const data = await response.json();
    //     console.log("Data");
    //     console.log(data);
    //     setdeletedAcceptedRequests(data);
    //     setMessage(data);
    //     // Count the number of unread messages
    //     const unreadMessages = data.filter(
    //       (message) => message.status === "Unread"
    //     );
    //     setunreadMessageCount(unreadMessages.length);
    //   } catch (error) {
    //     console.error("Error fetching unread notification count:", error);
    //   }
    // };

    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/get/get_unread_read_message/" + parsedID
        );
        const data = await response.json();

        // Fetch profile images for each user associated with unread messages
        const fetchProfileImages = data.map(async (message) => {
          try {
            const userResponse = await fetch(
              `http://localhost:5000/api/auth/${message.receiverId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const userData = await userResponse.json();
            return { ...message, profileImg: userData[0].profileImg }; // Assuming profileImg is the property containing the profile image URL
          } catch (error) {
            console.error("Error fetching user data:", error);
            return message; // Return the message without the profile image
          }
        });

        // Wait for all fetch requests to complete
        const messagesWithProfileImages = await Promise.all(fetchProfileImages);

        setdeletedAcceptedRequests(messagesWithProfileImages);
        setMessage(messagesWithProfileImages);

        // Count the number of unread messages
        const unreadMessages = messagesWithProfileImages.filter(
          (message) => message.status === "Unread"
        );
        setunreadMessageCount(unreadMessages.length);
      } catch (error) {
        console.error("Error fetching unread notification count:", error);
      }
    };



    if (id && parsedID) {
      Promise.all([
        fetchData(),
        fetchSenderName(),
        fetchFriendRequests(),
        fetchUnreadNotificationCount(),
        fetchUnreadMessages(),
      ])
        .then(() => setIsLoading(false))
        .catch((error) => console.error("Error during data fetching:", error));
    }
  }, [id, parsedID, checkAuthentication]);

  useEffect(() => {
    // const newSocket = io("http://localhost:5500");
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to fetch profile image based on user ID

  useEffect(() => {
    if (socket) {
      socket.on("friendRequest", async ({ friendRequestData, from, to }) => {
        if (to === parsedID) {
          // Check if the friend request is not already in the state
          if (
            !friendRequests.some(
              (request) =>
                request.senderUserId === friendRequestData.senderUserId
            )
          ) {
            const profile = await fetchProfileImage(friendRequestData.senderUserId);
            const user = await profile.json();
            friendRequestData.profileImg = user[0].profileImg;
            // Using the callback function to avoid race conditions
            setFriendRequests((prevRequests) => {
              // Check again inside the callback to ensure no race conditions
              if (
                !prevRequests.some(
                  (request) =>
                    request.senderUserId === friendRequestData.senderUserId
                )
              ) {
                return [...prevRequests, friendRequestData];
              }
              return prevRequests;
            });
            setUnreadNotificationCount((prevCount) => prevCount + 1);
          }
        }
      });

      // Get Friend Request
      socket.on(
        "acceptFriendRequest",
        async ({ acceptFriendRequestData, from, to, fromUserId }) => {

          if (fromUserId === parsedID && socket) {
            if (
              !deletedAcceptedRequests.some(
                (request) =>
                  request.senderUserId === acceptFriendRequestData.senderUserId
              )
            ) {
              try {
                const response = await fetchProfileImage(
                  acceptFriendRequestData.receiverUserId
                );
                const user = await response.json();
                const profileImg = user[0].profileImg;
                setMessage((prevRequests) => {
                  // Check again inside the callback to ensure no race conditions
                  if (
                    !prevRequests.some(
                      (request) =>
                        request.senderUserId ===
                        acceptFriendRequestData.senderUserId
                    )
                  ) {
                    // Modify the message to include the declined information
                    const acceptedMessage = {
                      ...acceptFriendRequestData,
                      message: `${acceptFriendRequestData.receiverUsername} has accepted your friend request`,
                      profileImg: profileImg,
                    };

                    // return [...prevRequests, deleteFriendRequestData];
                    return [...prevRequests, acceptedMessage];
                  }
                  return prevRequests;
                });
                setunreadMessageCount((prevCount) => prevCount + 1);
              } catch (error) {
                console.error("Error fetching profile image:", error);
              }
            }
          }
        }
      );

      socket.on(
        "deleteFriendRelationship",
        async ({ deleteFriendRequestData, from, to }) => {
          if (from === parsedID && socket) {
            if (
              !deletedAcceptedRequests.some(
                (request) =>
                  request.senderUserId === deleteFriendRequestData.senderUserId
              )
            ) {
              try {
                const response = await fetchProfileImage(
                  deleteFriendRequestData.receiverUserId
                );
                const user = await response.json();
                const profileImg = user[0].profileImg;                // Using the callback function to avoid race conditions
                setMessage((prevRequests) => {
                  // Check again inside the callback to ensure no race conditions
                  if (
                    !prevRequests.some(
                      (request) =>
                        request.senderUserId ===
                        deleteFriendRequestData.senderUserId
                    )
                  ) {
                    // Modify the message to include the declined information
                    const declinedMessage = {
                      ...deleteFriendRequestData,
                      message: `${deleteFriendRequestData.receiverUsername} has declined your friend request`,
                      profileImg: profileImg,
                    };

                    // return [...prevRequests, deleteFriendRequestData];
                    return [...prevRequests, declinedMessage];
                  }
                  return prevRequests;
                });
                setunreadMessageCount((prevCount) => prevCount + 1);
              } catch (error) {
                console.error("Error fetching profile image:", error);
              }
            }
          }
        }
      );
    }
    return () => {
      if (socket) {
        socket.off("sendfriendRequest");
        socket.off("deleteFriendRelationship");
      }
    };
  }, [socket, senderName]);

  const fetchProfileImage = async (userId) => {
    try {
      // Make a GET request to fetch the profile image URL from your backend API
      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response; // Return the response object
    } catch (error) {
      console.error("Error fetching profile image:", error);
      throw error; // Throw the error to be caught by the caller
    }
  };

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue); // Update the query state as the user types

    try {
      // Make an AJAX request to fetch search suggestions from the backend
      const response = await axios.get(
        "http://localhost:5000/api/auth/search-suggestions?query=",
        {
          params: { query: inputValue }, // Pass the search query as a parameter
        }
      );

      // Update the suggestions state with the response data
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  // //////////////////////////
  const handleSearchClick = () => {
    setPopupVisible(true); // Show the search popup when search icon is clicked
  };

  useEffect(() => {
    // Event listener to close search popup when clicked outside of it
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    // Add event listener when search popup is open
    if (popupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupVisible]);

  // /////////////////////////////////////////////////////////

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const openNotifPanel = async () => {
    if (message.length === 0) {
      toast("No messages to show!");
      return;
    }

    try {
      // Call the API to mark messages as "Read"
      const response = await fetch(
        "http://localhost:5000/api/get/markMessagesAsRead/" + parsedID,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Messages marked as Read successfully");
      } else {
        console.error("Failed to mark messages as Read");
      }
    } catch (error) {
      console.error("Error marking messages as Read:", error);
    }

    setNotifMenu(!notifMenu);
    setunreadMessageCount(0);
  };

  const handleMessageRedirect = () => {
    window.location.href = "/message";
    // toggleTheme();
  };

  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleIconClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/get/delete_unread_friend_message/" +
          parsedID,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Unread friend messages deleted successfully");
        // Additional logic if needed
      } else {
        console.error("Failed to delete unread friend messages");
      }
    } catch (error) {
      console.error("Error while deleting unread friend messages:", error);
    }

    if (friendRequests.length === 0) {
      toast("No friend requests to show!!!!");
      return;
    }

    // Check for duplicate entries and update the state accordingly
    const uniqueFriendRequests = friendRequests.reduce((unique, request) => {
      const isDuplicate = unique.some(
        (uniqueRequest) => uniqueRequest.senderUserId === request.senderUserId
      );
      return isDuplicate ? unique : [...unique, request];
    }, []);

    setUnreadNotificationCount(0);
    setFriendRequests(uniqueFriendRequests);
    setMenuVisible(!isMenuVisible);
  };

  // Function to confirm the request
  const handleConfirm = async (senderName, receiverName) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/friend_request/acceptFriendRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderUsername: senderName,
            receiverUsername: receiverName,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        // Use a callback function to ensure proper updating of state
        setFriendRequests((prevRequests) =>
          prevRequests.filter(
            (request) => request.senderUsername !== senderName
          )
        );
        // Check if there are no more friend requests, then close the notification panel
        if (friendRequests.length === 1) {
          setMenuVisible(false);
        }
        // Close the friend request menu
        setMenuVisible(false);
      } else {
        toast.error("Failed to accept friend request");
      }
    } catch (error) {
      toast.error("An error occurred while accepting friend request");
    }
  };

  const handleDelete = async (senderName, receiverName) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/friend_request/deleteFriendRelationship",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderUsername: senderName,
            receiverUsername: receiverName,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        // Use a callback function to ensure proper updating of state
        setFriendRequests((prevRequests) =>
          prevRequests.filter(
            (request) => request.senderUsername !== senderName
          )
        );
        // Check if there are no more friend requests, then close the notification panel
        if (friendRequests.length === 1) {
          setMenuVisible(false);
        }
        // Close the friend request menu
        setMenuVisible(false);
      } else {
        toast.error("Failed to decline friend request");
      }
    } catch (error) {
      toast.error("An error occurred while declining friend request");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <CircularProgress />
      </div>
    );
  }

  const toggleRightBar = () => {
    setShowRightBar(!showRightBar);
  };


  // const styles = {
  //   backgroundColor: theme === "light" ? "#ffffff" : "#000000",
  //   color: theme === "light" ? "#000000" : "#ffffff",
  // };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <div className={styles.left_navbar}>
          <Link to="/" style={{ textDecoration: "none" }}>
            {/* <span className={styles.title}>{Logo}</span> */}
            <img className={styles.title} src={Logo} />
          </Link>

          {/* <HomeOutlinedIcon className={styles.icon} /> */}

          {/* <GridViewOutlinedIcon className={styles.icon} /> */}

          <div className={styles.search} ref={searchRef}>
            <SearchOutlinedIcon
              className={styles.icon}
              onClick={() => {
                handleToggle();
                handleSearchClick();
              }}
              //  onClick={handleSearchClick}
            />
            {toggle ? (
              <input
                type="text"
                placeholder="Search..."
                className={styles.extended}
                onClick={handleSearchClick}
                onChange={handleInputChange}
              />
            ) : (
              <input
                type="text"
                placeholder="Search..."
                className={styles.default}
                onClick={handleSearchClick}
                onChange={handleInputChange}
              />
            )}
            {popupVisible && (
              <div className={styles.searchPopUpModal}>
                <h4>Search Results</h4>
                <div className={styles.searchPopUpUserContainer}>
                  {suggestions.length === 0 ? (
                    <p>No search results found</p>
                  ) : (
                    suggestions.map((user, index) => (
                      <div className={styles.searchUser} key={index}>
                        <a href={`http://localhost:3000/profile/${user.id}`}>
                          <img
                            src={`http://localhost:5000/${user.profileImg}`}
                            alt={`user${index}`}
                          />
                        </a>
                        <p>
                          <a href={`http://localhost:3000/profile/${user.id}`}>
                            {user.username}
                          </a>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Menu */}

          <MenuRoundedIcon className={styles.menuIcon} onClick={toggleMenu} />
        </div>

        <div className={styles.right_navbar}>
          <div className={styles.userOptPart}>
            {/* <a to="/message"> */}
            <MessageRoundedIcon
              className={styles.icon}
              onClick={handleMessageRedirect}
            />
            {/* </a> */}

            {/* dark mode button */}
            <div className={styles.profileIconContainer}>
              <PersonRoundedIcon
                onClick={handleIconClick}
                className={styles.friendsBadgeIcon}
              />
              {unreadNotificationCount > 0 && (
                <div className={styles.friendsBadge}>
                  {unreadNotificationCount}
                </div>
              )}
            </div>
            {isMenuVisible && (
              <div className={styles.popup_menu}>
                <ul className={styles.requests}>
                  {friendRequests.map((user, index) => {
                    const username =
                      user.userDetails && user.userDetails.length > 0
                        ? user.userDetails[0].username
                        : "";
                    return (
                      <li className={styles.request} key={index}>
                        <div className={styles.left}>
                          {/* <img src={userPhoto} /> */}
                          <img src={`http://localhost:5000/${user.profileImg}`} />
                        </div>
                        <p className={styles.middle}>
                          <a
                            style={{ textDecoration: "none" }}
                            href={`/profile/${user.senderUserId}`}
                            className={styles.userNameLink}
                          >
                            <span>{user.senderUsername}</span>
                          </a>
                          requested to follow you
                        </p>

                        <div className={styles.right}>
                          <button
                            onClick={() =>
                              handleConfirm(user.senderUsername, senderName)
                            }
                            className={styles.acceptBtn}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(user.senderUsername, senderName)
                            }
                            className={styles.declineBtn}
                          >
                            Decline
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <EmailRoundedIcon
              className={styles.messagesBadgeIcon}
              onClick={openNotifPanel}
            />
            <div className={styles.messagesBadge}>{unreadMessageCount}</div>
            <NotificationsRoundedIcon
              onClick={openNotifPanel}
              className={styles.notifBadgeIcon}
            />
            <div className={styles.messagesBadge}>{unreadMessageCount}</div>
            {notifMenu ? (
              <div ref={notifPanelRef} className={styles.notifPanel}>
                <div className={styles.notifPanelHeader}>
                  <h1>Notification Panel</h1>
                  <CloseIcon onClick={() => setNotifMenu(false)} />
                </div>
                <div className={styles.notifcontainer}>
                  <ul className={styles.requests}>
                    {message.map((user, index) => {
                      const username =
                        user.userDetails && user.userDetails.length > 0
                          ? user.userDetails[0].username
                          : "";
                      return (
                        <li className={styles.request} key={index}>
                          <div className={styles.left}>
                            <img
                              src={`http://localhost:5000/${user.profileImg}`}
                            />
                          </div>
                          <p className={styles.middle}>
                            <a
                              style={{ textDecoration: "none" }}
                              href={`/profile/${user.senderUserId}`}
                              className={styles.userNameLink}
                            >
                              <span>{user.receiverUserName}</span>
                            </a>
                            {/* {} */}
                            {/* {user.status === "Declined" ? "declined your request" : "accepted your request"} */}
                            {user.message}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : null}
            <div className={styles.notifBadge}>{unreadNotificationCount}</div>
          </div>

          <div className={styles.user}>
            <a
              style={{ textDecoration: "none" }}
              href={`/profile/${parsedID}`}
              className={styles.userNameLink}
            >
              <img src={`http://localhost:5000/${userPhoto}`} />
              <span>{username}</span>
            </a>
          </div>
        </div>
        {/* <ToastContainer/> */}
      </div>
      <div className={styles.bottomNavbar}>
        <Link to={`/`}>
          <HomeRoundedIcon className={styles.bottomNavbarIcon} />
        </Link>
        <Link to={`/groupmessage`}>
          <GroupRoundedIcon
            className={styles.bottomNavbarIcon}
            onClick={toggleRightBar}
          />
        </Link>
        {showRightBar && <RightBar className={styles.bottomNavbarIcon} />}
        <Link to={`/message`}>
          <MessageRoundedIcon className={styles.bottomNavbarIcon} />
        </Link>
        <Link to={`/saved/${userId}`}>
          <BookmarkRoundedIcon className={styles.bottomNavbarIcon} />
        </Link>
        <Link to={`/settings`}>
          <SettingsRoundedIcon className={styles.bottomNavbarIcon} />
        </Link>
        <MenuRoundedIcon
          className={styles.bottomNavbarIcon}
          onClick={toggleMenu}
        />
      </div>
    </div>
  );
};

export default Navbar;
