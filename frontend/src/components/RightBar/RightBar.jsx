import React, { useEffect, useState } from "react";
import styles from "./rightbar.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../Contexts/authContext";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const RightBar = () => {
  const [toggle, setToggle] = useState(false);
  const [usersWithNames, setUsersWithNames] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [senderName, setSenderName] = useState(null);
  const [loading, setLoading] = useState(true);
  const parsedId = parseInt(id);
  const [socket, setSocket] = useState(null); //For setting the socket connection

  useEffect(() => {
    const newSocket = io("http://localhost:5500");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuthentication();
        const userRes = await fetch("http://localhost:5000/api/auth/" + parsedId, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const userDetails = await userRes.json();

        // Check if userDetails is defined and not empty
        if (userDetails && userDetails.length > 0 && userDetails[0]) {
          setSenderName(userDetails[0].username);
        } else {
          console.error("Invalid or empty user details:", userDetails);
        }

        // Fetch other data
        const filteredUserRes = await fetch(
          "http://localhost:5000/api/api/filteredSuggestions/" + parsedId
        );
        const filteredData = await filteredUserRes.json();

        const formattedResults = Object.entries(filteredData.filteredResults).map(
          ([userId]) => ({ userId })
        );

        const promises = formattedResults.map(async ({ userId }) => {
          const userRes = await fetch("http://localhost:5000/api/auth/" + userId, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const userData = await userRes.json();
          return { ...userData, userId };
        });

        const usersWithNames = await Promise.all(promises);
        setUsersWithNames(usersWithNames);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id, checkAuthentication, parsedId]);

  const showSuggestedUsers = () => {
    setToggle(!toggle);
  };

  const closeSuggestedUsers = () => {
    setToggle(!toggle);
  };






  const handleFollow = async (senderUsername, receiverUsername) => {
    alert("Called");
    console.log("Called");
    alert(senderName);
    alert(receiverUsername);
    try {
      const response = await fetch('http://localhost:5000/api/friend_request/sendFriendRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderUsername, receiverUsername }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }
  
      // Emit Socket.IO event after successful friend request
      socket.emit('friendRequest', {
        action: 'removeSuggestion',
        senderUsername: senderUsername, // Make sure to get the sender's ID
        receiverUsername: receiverUsername, // Make sure to get the receiver's ID
      });
  
      const result = await response.json();
      console.log(result);
  
      // Update state to remove the user suggestion
      setUsersWithNames((prevUsers) => {
        return prevUsers.filter(user => user[0].username !== receiverUsername);
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  
  

  const handleDismiss = (receiverUsername , id) => {
    alert(receiverUsername);
    alert(id);
  // Emit a socket event to inform the backend about the dismissal
  socket.emit('dismissSuggestion', {
    targetUserId: parsedId, //It is the logged user whom i am displaying the suggestions
    dismissedUserId: id,
  });

    // Update state to remove the dismissed user suggestion
    setUsersWithNames((prevUsers) => {
      return prevUsers.filter((user) => user[0].username !== receiverUsername);
    });
  
    // You may also want to emit a socket event or make an API call to inform the server about the dismissal
  };

  
  useEffect(() => {
    if (socket) {
      socket.on('friendRequest', (data) => {
        console.log('Received friend request:', data);
  
        if (data.action === 'removeSuggestion') {
          alert("Called2");
          // Update state to remove the user suggestion
          setUsersWithNames((prevUsers) => {
            return prevUsers.filter(user => user[0].username !== data.senderUsername);
          });
        } else {
          // Handle other friend request actions if needed
        }
      });
    }
  
    console.log("setUsersWithNames");
    console.log(usersWithNames);

    return () => {
      if (socket) {
        socket.off('friendRequest');
      }
    };
  }, [socket]);
  

  const displayedUsers = showMore ? usersWithNames : usersWithNames.slice(0, 2);

  console.log(displayedUsers);

  return (
    <div className={styles.container}>
      <div className={styles.RightBar}>
        <div className={styles.item}>
          <h1 className={styles.header}>Suggestions For You</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            displayedUsers.map((user, index) => (
              <div key={user.userId} className={styles.user}>
                <div className={styles.userInfo}>
                  <a
                    style={{ textDecoration: "none" }}
                    href={`/profile/${user.userId}`}
                    className={styles.userNameLink}
                  >
                    <h3>{user[0].username}</h3>
                  </a>
                </div>
                <div className={styles.buttons}>
                  <button onClick={() =>  handleFollow(senderName, user[0].username)} className={styles.btn1}>Follow</button>
                  <button onClick={() => handleDismiss(user[0].username , user[0].id )} className={styles.btn2}>Dismiss</button>
                </div>
              </div>
            ))
          )}

          {usersWithNames.length > 2 && (
            <div className={styles.more} onClick={showSuggestedUsers}>
              More
            </div>
          )}

          {toggle ? (
            <div className={styles.suggestedUsers}>
              <div className={styles.heading}>
                <h2>All Suggestions</h2>
                <CloseIcon
                  onClick={closeSuggestedUsers}
                  className={styles.closeIcon}
                />
              </div>
              <ul>
                {usersWithNames.map((user) => (
                  <div className={styles.user} key={user.userId}>
                    <div className={styles.userInfo}>
                      <a
                        style={{ textDecoration: "none" }}
                        href={`/profile/${user.userId}`}
                        className={styles.userNameLink}
                      >
                        <h3>{user[0].username}</h3>
                      </a>
                    </div>
                    <div className={styles.buttons}>
                      <button onClick={() => handleFollow(senderName, user[0].username)} className={styles.btn1}>Follow</button>
                      <button className={styles.btn2}>Dismiss</button>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          ) : (
            <div className={styles.postOpt}></div>
          )}
        </div>

                {/* box1 content ends here */}

                {/* box2 content starts here */}

        <div className={styles.item2}>
          <h1 className={styles.header}>Latest Activities</h1>
          <div className={styles.user2}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
            </div>
            <p>changed their cover picture</p>
          </div>
          <div className={styles.user3}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
            </div>
            <p>liked a post</p>
          </div>
          <div className={styles.user4}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
            </div>
            <p>commented on your post</p>
          </div>
          <div className={styles.user5}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
            </div>
            <p>shared a post</p>
          </div>
          <div className={styles.more}>More</div>
        </div>

             {/* box2 content ends here */}



       {/* box3 content starts here */}
       <div className={styles.item3}>
          <h1 className={styles.header}>Online Friends</h1>
          <div className={styles.user6}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
              <circle></circle>
            </div>
          </div>
          <div className={styles.user7}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
              <circle></circle>
            </div>
          </div>
          <div className={styles.user8}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
              <circle></circle>
            </div>
          </div>
          <div className={styles.user9}>
            <div className={styles.userInfo}>
              {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
              <h3>John Doe</h3>
              <circle></circle>
            </div>
          </div>
        </div>
        {/* box3 content ends here */}
      </div>
    </div>
  );
};

export default RightBar;
