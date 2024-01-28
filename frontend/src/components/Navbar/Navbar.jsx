import React, { useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";
import { useState } from "react";
// Toggler
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import CircularProgress from "@mui/material/CircularProgress"; // Add this line

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ toggleMenu, user }) => {
  const [toggle, setToggle] = useState(false);
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Setting the loading
  const [friendRequests, setFriendRequests] = useState([]); //Sets the friends requets spreading with the old requests with the new requests in realtime
  const [senderName, setSenderName] = useState(null); //Setting the current / logged user name in the state
  const [username, setUsername] = useState(null); //Setting the current / logged user name in the state
  const [userPhoto, setUserPhoto] = useState(null); //Setting the userprofile image from the database
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0); //It is for unreadnotification (use case : like facebook notification..)
  const [message, setMessage] = useState([]); //This is for the all kind of messages..(example :User A has accepted the friend request e.t.c);
  const parsedID = parseInt(id);
  const [notifMenu, setNotifMenu] = useState(false); //for notif panel
  const [deletedAcceptedRequests, setdeletedAcceptedRequests] = useState([]); //Sets the friends requets spreading with the old requests with the new requests in realtime
  const [unreadMessageCount, setunreadMessageCount] = useState(0); //It is for unreadnotification (use case : like facebook notification..)
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState(null);

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
        console.log(parsedID);
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
        setFriendRequests(data);
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

    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/get/get_unread_read_message/" + parsedID
        );
        const data = await response.json();
        setdeletedAcceptedRequests(data);
        setMessage(data);
        // Count the number of unread messages
        const unreadMessages = data.filter(
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

  useEffect(() => {
    if (socket) {
      socket.on("friendRequest", ({ friendRequestData, from, to }) => {
        if (to === parsedID) {
          // Check if the friend request is not already in the state
          if (
            !friendRequests.some(
              (request) =>
                request.senderUserId === friendRequestData.senderUserId
            )
          ) {
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
        ({ acceptFriendRequestData, from, to }) => {
          console.log("Accepted the friedn Request");
          console.log(acceptFriendRequestData);

          if (from === parsedID) {
            console.log("Received friend request from the sender");
            console.log(acceptFriendRequestData);
          }
        }
      );


      socket.on(
        "deleteFriendRelationship",
        ({ deleteFriendRequestData, from, to }) => {
          if (from === parsedID && socket) {
            if (
              !deletedAcceptedRequests.some(
                (request) =>
                  request.senderUserId === deleteFriendRequestData.senderUserId
              )
            ) {
              // Using the callback function to avoid race conditions
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
                  };

                  // return [...prevRequests, deleteFriendRequestData];
                  return [...prevRequests, declinedMessage];
                }
                return prevRequests;
              });
              setunreadMessageCount((prevCount) => prevCount + 1);
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

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const openNotifPanel = async () => {

    if(message.length === 0){
      toast("No messages to show!!!!");
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
  const handleConfirm = async (senderName, receiverName) => {};

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

  return (
    <div className={styles.navbar}>
      <div className={styles.left_navbar}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className={styles.title}>SocialMedia</span>
        </Link>

        <HomeOutlinedIcon className={styles.icon} />
        <DarkModeOutlinedIcon className={styles.icon} />
        <GridViewOutlinedIcon className={styles.icon} />

        <div className={styles.search}>
          <SearchOutlinedIcon className={styles.icon} onClick={handleToggle} />
          {toggle ? (
            <input
              type="text"
              placeholder="Search..."
              className={styles.extended}
            />
          ) : (
            <input
              type="text"
              placeholder="Search..."
              className={styles.default}
            />
          )}
        </div>

        {/* Sidebar Meeu */}

        <MenuRoundedIcon className={styles.menuIcon} onClick={toggleMenu} />

        {/* <MenuRoundedIcon className='menuIcon'  /> */}

        {/* <LeftBar isVisible={toggle} /> */}
      </div>

      <div className={styles.right_navbar}>
        {/* <PersonOutlinedIcon onClick={handleIconClick} /> */}
        {/* PersonOutlinedIcon with unread notification count badge */}
        <div className={styles.profileIconContainer}>
          <PersonOutlinedIcon
            onClick={handleIconClick}
            className={styles.friendsBadgeIcon}
          />
          {unreadNotificationCount > 0 && (
            <div className={styles.friendsBadge}>{unreadNotificationCount}</div>
          )}
        </div>
        {isMenuVisible && (
          <div className={styles.popup_menu}>
            <ul className={styles.requests}>
              {friendRequests.map((user, index) => {
                console.log(user);
                const username =
                  user.userDetails && user.userDetails.length > 0
                    ? user.userDetails[0].username
                    : "";
                return (
                  <li className={styles.request} key={index}>
                    <div className={styles.left}>
                      {/* <img
                        className={styles.ig}
                        src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                        alt="john doe"
                      /> */}
                      <img src={userPhoto} />
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
        <EmailOutlinedIcon
          className={styles.messagesBadgeIcon}
          onClick={openNotifPanel}
        />
        <div className={styles.messagesBadge}>{unreadMessageCount}</div>
        <NotificationsOutlinedIcon
          onClick={openNotifPanel}
          className={styles.notifBadgeIcon}
        />
        <div className={styles.messagesBadge}>{unreadMessageCount}</div>
        {notifMenu ? (
          <div className={styles.notifPanel}>
            <div className={styles.notifPanelHeader}>
              <h1>Notification Panel</h1>
            </div>
            <div className={styles.notifcontainer}>
              <ul className={styles.requests}>
                {message.map((user, index) => {
                  console.log("Message User");
                  console.log(user);
                  const username =
                    user.userDetails && user.userDetails.length > 0
                      ? user.userDetails[0].username
                      : "";
                  return (
                    <li className={styles.request} key={index}>
                      <div className={styles.left}>
                        <img src={userPhoto} />
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
        ) : (
          <div className={styles.closedNotifPanel}></div>
        )}
        <div className={styles.notifBadge}>{unreadNotificationCount}</div>
        <div className={styles.user}>
          <a
            style={{ textDecoration: "none" }}
            href={`/profile/${parsedID}`}
            className={styles.userNameLink}
          >
            <img src={userPhoto} />

            <span>{username}</span>
          </a>
        </div>
      </div>
      {/* <ToastContainer/> */}
    </div>
  );
};

export default Navbar;
