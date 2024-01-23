import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stories from "stories-react";
import "stories-react/dist/index.css";
import styles from "./stories.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";
import axios from "axios";

const Story = () => {
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [showStory, setShowStory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showComments, setShowComments] = useState(null);
  const [friendDetail, setFriendDetail] = useState([]);

  //   Soura added (20/1/2024)
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Setting the loading
  const [friend, setFriend] = useState({ friends: [] });
  const [senderName, setSenderName] = useState(null); //Setting the current / logged user name in the state
  const [username, setUsername] = useState(null); //Setting the current / logged user name in the state
  const [userPhoto, setUserPhoto] = useState(null); //Setting the userprofile image from the database
  const [friendStories, setFriendStories] = useState([]);
  const parsedID = parseInt(id);

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

    // async function fetchUserFriends() {
    //   console.log("Entered in the function");
    //   try {
    //     const friendsRes = await axios.get(
    //       "http://localhost:5000/api/friend_request/getFriends/" + parsedID
    //     );
    //     const friends = friendsRes.data;
    //     setFriend(friends);
    //     // Fetch details for each friend
    //     const friendDetails = await Promise.all(
    //       friends.friends.map(async (friend) => {
    //         const friendRes = await axios.post(
    //           "http://localhost:5000/api/auth/" + friend.friendId
    //         );
    //         return friendRes.data;
    //       })
    //     );

    //     setFriendDetail(friendDetails);
    //   } catch (error) {
    //     console.error("Error fetching friends data:", error);
    //   }
    // }

    async function fetchUserFriends() {
      console.log("Entered in the function");
      try {
        const friendsRes = await axios.get(
          "http://localhost:5000/api/friend_request/getFriends/" + parsedID
        );
        const friends = friendsRes.data;
        setFriend(friends);

        // Fetch details and stories for each friend
        const friendDetailsAndStories = await Promise.all(
          friends.friends.map(async (friend) => {
            // Fetch friend details
            const friendDetailsRes = await axios.post(
              "http://localhost:5000/api/auth/" + friend.friendId
            );
            const friendDetails = friendDetailsRes.data;

            console.log("Friend Id");
            console.log(friend.friendId);
            // Fetch stories for the friend
            const storiesRes = await axios.get(
              "http://localhost:5000/api/stories/getStories/" + friend.friendId
            );
            const stories = storiesRes.data;

            return { friendDetails, stories };
          })
        );

        // Filter out entries with empty friend stories arrays
        const filteredFriendDetailsAndStories = friendDetailsAndStories.filter(
          (item) => item.stories.length > 0
        );

        // Separate friend details and stories into separate state variables
        const friendDetails = filteredFriendDetailsAndStories.map(
          (item) => item.friendDetails
        );
        const friendStories = filteredFriendDetailsAndStories.map(
          (item) => item.stories
        );

        setFriendDetail(friendDetails);
        setFriendStories(friendStories); // Assume you have a state variable for friend stories
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    }

    if (id && parsedID) {
      Promise.all([fetchData(), fetchSenderName(), fetchUserFriends()])
        .then(() => setIsLoading(false))
        .catch((error) => console.error("Error during data fetching:", error));
    }
  }, [id, parsedID, checkAuthentication]);

  console.log("parsedID");
  console.log(senderName + parsedID);
  console.log("Friends");
  console.log(friend);
  console.log(friendDetail);
  console.log("Friends Stories");
  console.log(friendStories);

  useEffect(() => {
    const newSocket = io("http://localhost:5500");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch data from http://localhost:5000/api/stories/allStories
    fetch("http://localhost:5000/api/stories/allStories")
      .then((response) => response.json())
      .then((data) => setStories(data))
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  useEffect(() => {});

  const showFullStory = (story) => {
    setShowStory(!showStory);
    setSelectedStory(story);
    setSelectedStoryIndex(stories.indexOf(story));
  };

  const navigateToNextStory = (e) => {
    e.stopPropagation();
    const nextIndex = (selectedStoryIndex + 1) % stories.length;
    setSelectedStoryIndex(nextIndex);
    setSelectedStory(stories[nextIndex]);
  };

  const navigateToPreviousStory = (e) => {
    e.stopPropagation();
    const previousIndex =
      selectedStoryIndex === 0 ? stories.length - 1 : selectedStoryIndex - 1;
    setSelectedStoryIndex(previousIndex);
    setSelectedStory(stories[previousIndex]);
  };

  const openComments = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const closeComments = (e) => {
    e.stopPropagation();
    setShowComments(false);
  };

  //   Added By Soura
  const handleMessageButtonClick = () => {
    alert("Called");
    alert(parsedID);
    alert(username);
    navigate("/create_story", {
      state: { userId: parsedID, userName: senderName, clicked: true },
    });
  };

  return (
    <div className={styles.stories}>
      <div className={styles.story} onClick={() => showFullStory(null)}>
        {showStory ? (
          <div className={styles.showFullStory}>
            {selectedStory && (
              <>
                <div className={styles.userNameStory}>
                  <img src="" alt="" />
                  <div className={styles.userHeading}>
                    <h1>{selectedStory.name}</h1>
                    <p>10 minutes ago</p>
                  </div>
                </div>
                <div className={styles.userStoryContent}>
                  <KeyboardArrowLeftIcon
                    className={styles.userStoryContentLeftOpt}
                    onClick={(e) => navigateToPreviousStory(e)}
                  />
                  <Stories
                    key={selectedStory.id}
                    width="427px"
                    height="540px"
                    background="transparent"
                    stories={[
                      {
                        type: "image",
                        url: selectedStory.mediaUrl,
                        duration: 5000,
                      },
                      // {
                      //   type: "image",
                      //   url: selectedStory.mediaUrl,
                      //   duration: 5000,
                      // },
                    ]}
                  />
                  <KeyboardArrowRightIcon
                    className={styles.userStoryContentRightOpt}
                    onClick={(e) => navigateToNextStory(e)}
                  />
                </div>

                <div className={styles.userStoryOpt}>
                  <FavoriteBorderIcon
                    className={styles.userOpt}
                  ></FavoriteBorderIcon>
                  <MessageIcon
                    className={styles.userOpt}
                    onClick={(e) => openComments(e)}
                  />
                </div>
                {showComments ? (
                  <div
                    className={styles.storyCommentShow}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.storyCommentHeader}>
                      <h1>Comments</h1>
                      <CloseIcon
                        className={styles.closeCommentsButton}
                        onClick={(e) => closeComments(e)}
                      />
                    </div>
                    <div className={styles.storyCommentContent}>
                      <textarea rows="4"></textarea>
                      <button>Post</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.storyCommentClose}></div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className={styles.closeFullStory}></div>
        )}
        <img src="" alt="" />

        <span>Soura Bose</span>
        {/* <button onClick={() => navigate("/create_story")}>+</button> */}
        <button onClick={handleMessageButtonClick}>+</button>
      </div>
      {stories.map((story) => (
        <div
          className={styles.story}
          key={story.id}
          onClick={() => showFullStory(story)}
        >
          <img src={story.img} alt={story.name} />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Story;
