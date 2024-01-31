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
  const [selectedFriendStories, setSelectedFriendStories] = useState([]);
  const [selectedFriendStoryImage, setSelectedFriendStoryImage] =
    useState(null);
  const [ownStories, ownSetStories] = useState([]);
  const [friendDetailIndex, setFriendDetailIndex] = useState(0);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_story", (story) => {
      const storyArray = [story];
        setFriendStories((prevStories) => [...prevStories, storyArray]);
      });
    }
    return () => {
      if (socket) {
        socket.off("new_story");
      }
    };
  }, [socket]);

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
        const response = await axios.get(
          `http://localhost:5000/api/stories/getStories/${parsedID}`
        );
        const stories = response.data.stories;
        ownSetStories(stories);
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

    async function fetchUserFriends() {
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
            // Fetch stories for the friend
            const storiesRes = await axios.get(
              "http://localhost:5000/api/stories/getStories/" + friend.friendId
            );
            const stories = storiesRes.data;

            // if (socket) {
            //   stories.forEach((story) => {
            //     socket.emit("new_story", story);
            //   });
            // }

            return { friendDetails, stories: stories.stories };
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


  const uniqueImageUrls = new Set();

  const showFullStory = async (userId, friendIndex = 0) => {
    setShowStory(!showStory);
    try {
      // Fetch stories for the specified user
      const response = await axios.get(
        `http://localhost:5000/api/stories/getStories/${userId}`
      );
      const userStories = response.data.stories;
      const user = await axios.post(`http://localhost:5000/api/auth/${userId}`);
      const userDeatil = user.data;
      console.log("User Details");
      console.log(userDeatil[0].profileImg);
      setSelectedFriendStoryImage(userDeatil[0].profileImg);
      if (userStories.length > 0) {
        setSelectedFriendStories(userStories);
        setSelectedStoryIndex(0);
        setSelectedStory(userStories[0]); // Set the selected story to the first story
      } else {
        setSelectedFriendStories([]);
        setSelectedStory(null);
      }
      setFriendDetailIndex(friendIndex); // Set the initial friend detail index
    } catch (error) {
      console.error("Error fetching user stories:", error);
      setSelectedFriendStories([]);
      setSelectedStory(null);
    }
  };

  // Update the navigateToNextStory function to switch between user friends' stories
  const navigateToNextStory = (e) => {
    e.stopPropagation();
    const nextFriendIndex = (selectedStoryIndex + 1) % friendStories.length;
    setSelectedStoryIndex(0); // Reset the story index to the first story of the next friend
    setFriendDetailIndex(nextFriendIndex); // Add this line to set the friend detail index

    const nextFriendStories = friendStories[nextFriendIndex];
    if (nextFriendStories && nextFriendStories.length > 0) {
      setSelectedFriendStories(nextFriendStories);
      setSelectedStory(nextFriendStories[0]); // Set the selected story to the first story of the next friend
    } else {
      setSelectedFriendStories([]);
      setSelectedStory(null);
    }
  };

  const navigateToPreviousStory = (e) => {
    e.stopPropagation();
    const previousIndex =
      selectedStoryIndex === 0
        ? selectedFriendStories.length - 1
        : selectedStoryIndex - 1;
    setSelectedStoryIndex(previousIndex);
    setSelectedStory(selectedFriendStories[previousIndex]);
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
                  <img
                    src={`http://localhost:5000/${selectedFriendStoryImage}`}
                    alt=""
                  />
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
                    stories={selectedFriendStories.map((story) => ({
                      type: "image",
                      url: story.downloadURL,
                      duration: 5000,
                    }))}
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
        <div
          className={styles.storyImg}
          onClick={(e) => {
            e.stopPropagation();
            e.target.tagName !== "IMG" && showFullStory(null);
          }}
        >
          <img
            src="https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
            className={styles.storyImgClass}
            // onClick={() => navigate("/create_story")}
            onClick={handleMessageButtonClick}
          />
        </div>
        <span>Soura Bose</span>
        {/* <button onClick={() => navigate("/create_story")}>+</button> */}
        <button onClick={handleMessageButtonClick}>+</button>
      </div>
      {friendStories.map((friendStory, index) =>
        friendStory.slice(0, 1).map((story) => {
          if (!uniqueImageUrls.has(story.downloadURL)) {
            uniqueImageUrls.add(story.downloadURL);
            return (
              <div
                className={styles.story}
                key={story._id}
                onClick={() => showFullStory(story.userId)}
              >
                <img src={story.downloadURL} alt={story.name} />
                <span>{story.name}</span>
              </div>
            );
          }
          return null;
        })
      )}
    </div>
  );
};

export default Story;
