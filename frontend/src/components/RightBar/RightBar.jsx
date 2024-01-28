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
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const [recentActivities, setRecentActivities] = useState([]);
  const parsedId = parseInt(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuthentication();
        const userRes = await fetch(
          "http://localhost:5000/api/auth/" + parsedId,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const userDetails = await userRes.json();

        console.log("User Id");
        console.log(userDetails[0].id);
        setUserId(userDetails[0].id);

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

        const formattedResults = Object.entries(
          filteredData.filteredResults
        ).map(([userId]) => ({ userId }));

        const promises = formattedResults.map(async ({ userId }) => {
          const userRes = await fetch(
            "http://localhost:5000/api/auth/" + userId,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
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

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("friendRequest", (data) => {
        console.log("Received friend request:", data);

        if (data.action === "removeSuggestion") {
          alert("Called2");
          // Update state to remove the user suggestion
          setUsersWithNames((prevUsers) => {
            return prevUsers.filter(
              (user) => user[0].username !== data.senderUsername
            );
          });
        } else {
          // Handle other friend request actions if needed
        }
      });

      // lIKE SOCKET EVENT.....
      socket.on("like", async ({ postId, userid, likeUser }) => {
        if (userid === parsedId) {
          try {
            // Fetch user details using the dislikeUser ID
            const userRes = await fetch(
              "http://localhost:5000/api/auth/" + likeUser,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const userData = await userRes.json();
            // Add the dislike activity with user details to the recent activities state
            setRecentActivities((prevActivities) => [
              ...prevActivities,
              {
                action: "like",
                userId: likeUser,
                postId,
                userName: userData[0].username,
              },
            ]);
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }
      });


      // Dislike socket event
      socket.on("dislike", async ({ postId, userid, dislikeUser }) => {
        if (userid === parsedId) {
          try {
            // Fetch user details using the dislikeUser ID
            const userRes = await fetch(
              "http://localhost:5000/api/auth/" + dislikeUser,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const userData = await userRes.json();
            console.log("Userdata");
            console.log(userData)


            // Add the dislike activity with user details to the recent activities state
            setRecentActivities((prevActivities) => [
              ...prevActivities,
              {
                action: "dislike",
                userId: dislikeUser,
                postId,
                userName: userData[0].username,
              },
            ]);
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("friendRequest");
      }
    };
  }, [socket, parsedId]);

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
      const response = await fetch(
        "http://localhost:5000/api/friend_request/sendFriendRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senderUsername, receiverUsername }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send friend request");
      }

      // Emit Socket.IO event after successful friend request
      socket.emit("friendRequest", {
        action: "removeSuggestion",
        senderUsername: senderUsername, // Make sure to get the sender's ID
        receiverUsername: receiverUsername, // Make sure to get the receiver's ID
      });

      const result = await response.json();
      console.log(result);

      // Update state to remove the user suggestion
      setUsersWithNames((prevUsers) => {
        return prevUsers.filter(
          (user) => user[0].username !== receiverUsername
        );
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleDismiss = (receiverUsername, id) => {
    alert(receiverUsername);
    alert(id);
    // Emit a socket event to inform the backend about the dismissal
    socket.emit("dismissSuggestion", {
      targetUserId: parsedId, //It is the logged user whom i am displaying the suggestions
      dismissedUserId: id,
    });

    // Update state to remove the dismissed user suggestion
    setUsersWithNames((prevUsers) => {
      return prevUsers.filter((user) => user[0].username !== receiverUsername);
    });

    // You may also want to emit a socket event or make an API call to inform the server about the dismissal
  };

  const displayedUsers = showMore ? usersWithNames : usersWithNames.slice(0, 2);

  console.log(displayedUsers);

  console.log("Recent Activity");
  console.log(recentActivities);

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
                  <button
                    onClick={() => handleFollow(senderName, user[0].username)}
                    className={styles.btn1}
                  >
                    Follow
                  </button>
                  <button
                    onClick={() => handleDismiss(user[0].username, user[0].id)}
                    className={styles.btn2}
                  >
                    Dismiss
                  </button>
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
                      <button
                        onClick={() =>
                          handleFollow(senderName, user[0].username)
                        }
                        className={styles.btn1}
                      >
                        Follow
                      </button>
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
          {recentActivities.map((activity, index) => (
            <div key={index} className={styles.user2}>
              <div className={styles.userInfo}>
                {/* You can customize the display based on the activity type (like or dislike) */}
                <h3>{activity.userName}</h3>
              </div>
              <p>{activity.action === "like" ? "liked" : "disliked"} a post</p>
            </div>
          ))}
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
