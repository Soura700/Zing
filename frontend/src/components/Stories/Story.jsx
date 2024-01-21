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

const Story = () => {
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [showStory, setShowStory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showComments, setShowComments] = useState(null);

  //   Soura added (20/1/2024)
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Setting the loading
  const [friendRequests, setFriendRequests] = useState([]); //Sets the friends requets spreading with the old requests with the new requests in realtime
  const [senderName, setSenderName] = useState(null); //Setting the current / logged user name in the state
  const [username, setUsername] = useState(null); //Setting the current / logged user name in the state
  const [userPhoto, setUserPhoto] = useState(null); //Setting the userprofile image from the database
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

    if (id && parsedID) {
      Promise.all([
        fetchData(),
        fetchSenderName(),
        fetchFriendRequests(),
      ])
        .then(() => setIsLoading(false))
        .catch((error) => console.error("Error during data fetching:", error));
    }
  }, [id, parsedID, checkAuthentication]);

  console.log("parsedID")
  console.log(senderName + parsedID)

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
                      {
                        type: "image",
                        url: selectedStory.mediaUrl,
                        duration: 5000,
                      },
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
      {stories.map((story, index) => (
        <div
          className={styles.story}
          key={story._id}
          onClick={() => showFullStory(story)}
        >
          <img
            src={story.mediaUrl}
            alt={story.name}
            onClick={() => showFullStory(story)}
          />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Story;
