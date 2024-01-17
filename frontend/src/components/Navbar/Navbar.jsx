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
  const [username, setUsername] = useState(null)//Setting the current / logged user name in the state
  const [userPhoto, setUserPhoto] = useState(null);//Setting the userprofile image from the database
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);//It is for unreadnotification (use case : like facebook notification..)
  const [message,setMessage] = useState([]); //This is for the all kind of messages..(example :User A has accepted the friend request e.t.c);
  const parsedID = parseInt(id);

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
        // console.log(data);
        // console.log(typeof data);

        setFriendRequests(data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    if (id && parsedID) {
      Promise.all([fetchData(), fetchSenderName(), fetchFriendRequests()])
        .then(() => setIsLoading(false))
        .catch((error) => console.error("Error during data fetching:", error));
    }
  }, [id, parsedID, checkAuthentication]);

  useEffect(() => {
    const newSocket = io("http://localhost:5500")
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  console.log("Previous");
  console.log(friendRequests);



  useEffect(() => {
    if (socket) {
      // socket.on('friendRequest', ({friendRequestData,from})=>{
      //   console.log("Received friend request from the sender");
      //   console.log(friendRequestData);

      //   // setFriendRequests((prevRequests)=>[...prevRequests , friendRequestData]);
      //   // setRealTimeFriendRequests(friendRequestData);
      //   // console.log("New");
      //   // console.log(friendRequestData);
      // })

      socket.on("friendRequest", ({ friendRequestData, from, to }) => {
        console.log(friendRequestData);

        // console.log(friendRequestData.receiverUserId);
        // console.log(friendRequestData);

        if (to === parsedID) {
          alert("Entered");
          console.log("Received friend request from the sender");
          console.log(friendRequestData);
          alert("Receiver Socket Id ");

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
          alert("Entered 2 ");
          console.log("Accepted the friedn Request");
          console.log(acceptFriendRequestData);

          if (from === parsedID) {
            alert("Entered");
            console.log("Received friend request from the sender");
            console.log(acceptFriendRequestData);
            alert("Receiver Socket Id ");
          }
        }
      );
      socket.on('deleteFriendRelationship',({ senderUsername, receiverUsername })=>{
        alert(`${senderUsername} has rejected your friend request for the receiver ${receiverUsername}`);
      })
    }

    return () => {
      if (socket) {
        socket.off("sendfriendRequest");
        socket.off("unreadNotificationCount");
      }
    };
  }, [socket, senderName]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleIconClick = () => {
    // Check if there are any friend requests

    // Check if there are any friend requests (both from the initial fetch and real-time)
    // const totalFriendRequests = [...friendRequests, ...realTimeFriendRequests];

    // console.log(totalFriendRequests);

    // if (totalFriendRequests.length === 0) {

    //   // Show a toast or perform any other action to notify the user
    //   toast("No freind requests to show!!!!")
    //   console.log("No friend requests");
    //   return;
    // }

    if (friendRequests.length === 0) {
      // Show a toast or perform any other action to notify the user
      toast("No friend requests to show!!!!");
      console.log("No friend requests");
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
    alert(senderName);
    alert(receiverName)
  };


  // Function to decline the friend request
  const handleDelete = async (senderName, receiverName) => {
    try {
      console.log(parsedID);
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

      if (data) {
        alert("ENTERED");
        setFriendRequests((prevRequests) =>
          prevRequests
            ? prevRequests.filter(
                (request) => request.senderUsername !== senderName
              )
            : []
        );

        if(friendRequests.length === 1){
          setMenuVisible(false);
        }
      } else {
        toast.error("Failed to decline friend requets");
      }
      // console.log(data);
      // console.log(typeof data);

      // setFriendRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
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
          <PersonOutlinedIcon onClick={handleIconClick} />
          {unreadNotificationCount > 0 && (
            <div className={styles.badge}>{unreadNotificationCount}</div>
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
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />

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
