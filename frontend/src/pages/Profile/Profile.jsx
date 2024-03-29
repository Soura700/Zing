import Stories from "stories-react";
import "stories-react/dist/index.css";
import styles from "./profile.module.css";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import SettingsIcon from "@mui/icons-material/Settings";
import LoggedUserPosts from "../../components/Posts/LoggedUserPosts";
import { useAuth } from "../../Contexts/authContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Posts from "../../components/Posts/Posts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import img from "../../assets/CoverImg.jpg";

const Profile = () => {
  const [user, setUser] = useState([]);
  // const [friend, setFriend] = useState([]);
  const [friend, setFriend] = useState({ friends: [] });
  const [username, setUsername] = useState([]);
  const [friendDetail, setFriendDetail] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [friendSuggestion, setFriendSuggestion] = useState([]);
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [userPhoto, setUserPhoto] = useState(null); //Setting the userprofile image from the database
  const { userId } = useParams();
  const parsedUserId = parseInt(userId);
  const [senderName, setSenderName] = useState(null);
  // Assuming loggedInUserId is the ID of the logged-in user
  const loggedInUserId = parseInt(id);
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStories, setShowStories] = useState(false);
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const [socket2, setSocket2] = useState(null); //For setting the socket connection
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [bio, setBio] = useState(null);
  const [status, setStatus] = useState(null);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

  // Condition to check if the current user is viewing their own profile
  const isOwnProfile = userId == loggedInUserId;
  const profileHeaderText = isOwnProfile
    ? "Your Friends"
    : `${username}'s Friends`;

  // Fetching the userdetails
  useEffect(() => {
    async function fetchOwnData() {
      try {
        const userRes = await fetch("http://localhost:5000/api/auth/" + id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const userResJson = await userRes.json();
        // setUser(userResJson);
        // setCoverPhoto(userResJson[0].coverImg);
        setSenderName(userResJson[0].username);
        // setSenderName(userResJson[0].username);
        // setUserPhoto(userResJson[0].profileImg);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Fetching the user details
    async function fetchUser() {
      try {
        const userRes = await fetch(
          "http://localhost:5000/api/auth/" + userId,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const userResJson = await userRes.json();
        setUser(userResJson);
        setUsername(userResJson[0].username);
        setCoverPhoto(userResJson[0].coverImg);
        setBio(userResJson[0].bio);
        setUserPhoto(userResJson[0].profileImg);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Fetching the  friends of the user
    async function fetchUserFriends() {
      try {
        const friendsRes = await axios.get(
          `http://localhost:5000/api/friend_request/getFriends/${userId}`
        );
        const friends = friendsRes.data;
        setFriend(friends);
        // Fetch details for each friend
        const friendDetails = await Promise.all(
          friends.friends.map(async (friend) => {
            const friendRes = await axios.post(
              "http://localhost:5000/api/auth/" + friend.friendId
            );
            return friendRes.data;
          })
        );

        setFriendDetail(friendDetails);
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    }

    async function suggestionOfFriends() {
      try {
        const filteredUserRes = await fetch(
          "http://localhost:5000/api/api/filteredSuggestions/" + loggedInUserId
        );
        if (!filteredUserRes.ok) {
          throw new Error("Failed to fetch filtered suggestions");
        }
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

          if (!userRes.ok) {
            throw new Error(`Failed to fetch user data for user ID ${userId}`);
          }
          const userData = await userRes.json();
          return { ...userData, userId };
        });
        const result = await Promise.all(promises);
        setFriendSuggestion(result);

        return result;
      } catch (error) {
        console.error("Error in suggestionOfFriends:", error);
        // Handle the error as needed, e.g., show an error message to the user
        throw error; // Propagate the error to the calling function if necessary
      }
    }

    const fetchStory = async () => {
      const storyUserId = parseInt(userId);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stories/getStories/${storyUserId}`
        );
        const stories = response.data.stories;
        setSelectedStory(stories);
        console.log(response.data);
        console.log("Stories");
        console.log(stories);
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    };

    const checkStatus = async () => {
      try {
        // Make a GET request to fetch the profile image URL from your backend API
        const response = await fetch(
          `http://localhost:5000/api/friend_request/checkFriendRequestStatus/${loggedInUserId}/${parsedUserId}`
        );
        const status = await response.json();
        setStatus(status.status);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        throw error; // Throw the error to be caught by the caller
      }
    };

    // Fetching the user details
    async function fetchSocialLinks() {
      try {
        const userRes = await fetch(
          "http://localhost:5000/api/settings/social-links/" + parsedUserId
        );
        const userResJson = await userRes.json();
        setSocialMediaLinks(userResJson);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchOwnData();
    fetchUser();
    fetchUserFriends();
    suggestionOfFriends();
    fetchStory();
    checkStatus();
    fetchSocialLinks();
  }, [id, checkAuthentication, status]);

  //  friendDetails with each element having a friendId property ..So removing the duplicates
  // Assuming friendDetail is the array you want to process
  const uniqueFriendDetails = friendDetail
    .flat() // Flatten the array of arrays
    .filter(
      (friend, index, self) =>
        index === self.findIndex((f) => f.id === friend.id)
    );

  // Now uniqueFriendDetails contains only unique friends based on the username
  const showSuggestedUsers = () => {
    setToggle(!toggle);
  };

  // Check if the logged-in user is friends with the user whose profile is being viewed
  const isFriendWithCurrentUser = friend.friends.some(
    (friend) => friend.friendId === loggedInUserId
  );

  const handleMessageButtonClick = () => {
    navigate("/message", {
      state: { userId: userId, userName: username, clicked: true },
    });
  };

  const handleProfileImageUpdate = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const formData = new FormData(); // Create FormData object
    formData.append("userId", loggedInUserId);
    formData.append("profilePicture", file); // Append the file to FormData object

    try {
      fetch("http://localhost:5000/api/bio_profile_img/update-profile", {
        method: "PUT",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Handle the response as needed
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } catch (error) {
      // console.error("Error updating profile image:", error);
    }
  };

  const handleCoverImageUpdate = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("userId", loggedInUserId);
    formData.append("coverPicture", file); // Append the file to FormData object

    try {
      fetch("http://localhost:5000/api/bio_profile_img/update-profile", {
        method: "PUT",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Handle the response as needed
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } catch (error) {
      // console.error("Error updating profile image:", error);
    }
  };

  const handleUserPhotoClick = () => {
    if (selectedStory && selectedStory.length > 0) {
      setShowStories(!showStories);
    } else {
      toast("No stories available");
    }
  };

  const getTimeDifferenceString = (timestamp) => {
    const currentDate = new Date();
    const timestampDate = new Date(timestamp);
    const timeDifferenceMilliseconds = currentDate - timestampDate;
    const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);

    if (timeDifferenceSeconds < 60) {
      return `${timeDifferenceSeconds} seconds ago`;
    } else if (timeDifferenceMinutes < 60) {
      return `${timeDifferenceMinutes} minutes ago`;
    } else {
      return `${timeDifferenceHours} hours ago`;
    }
  };

  const follow = async (senderUsername, receiverUsername) => {
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
      setStatus("Not Accepted");

      const result = await response.json();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    const newSocket2 = io("http://localhost:5500");
    setSocket2(newSocket2);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(
        "acceptFriendRequest",
        async ({ acceptFriendRequestData, from, to, fromUserId }) => {
          console.log("Accepted the friend Request");
          console.log(acceptFriendRequestData);

          if (fromUserId === loggedInUserId && socket) {
            // if (
            //   !deletedAcceptedRequests.some(
            //     (request) =>
            //       request.senderUserId === acceptFriendRequestData.senderUserId
            //   )
            // )
            {
              try {
                // Fetch the profile image of the new friend
                const response = await fetchProfileImage(
                  acceptFriendRequestData.receiverUserId
                );
                const user = await response.json();
                console.log(user);
                console.log(user[0].profileImg);
                const profileImg = user[0].profileImg;

                // Create the new friend object with the profile image
                const newFriend = {
                  id: acceptFriendRequestData.receiverUserId,
                  username: acceptFriendRequestData.receiverUsername,
                  profileImg: profileImg,
                };

                // Update the state to include the new friend
                setFriendDetail((prevFriendDetails) => [
                  ...prevFriendDetails,
                  newFriend,
                ]);
                setStatus("Accepted");
              } catch (error) {
                console.error("Error fetching profile image:", error);
              }
            }
          }
        }
      );
    }
  }, [socket, senderName]);

  // useEffect(()=>{
  //   const checkStatus = async ()=>{
  //     try {
  //       // Make a GET request to fetch the profile image URL from your backend API
  //       const response = await fetch(`http://localhost:5000/api/friend_request/checkFriendRequestStatus/${loggedInUserId}/${parsedUserId}`);
  //       console.log("Responseeeeeeeeee");
  //       const status = await response.json();
  //       console.log(status);
  //     } catch (error) {
  //       console.error("Error fetching profile image:", error);
  //       throw error; // Throw the error to be caught by the caller
  //     }
  //   }
  //   checkStatus();
  // },[id,isLoggedIn,checkAuthentication])

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

  const handleOverlayClick = (e) => {
    // Check if the click event target is the overlay itself
    if (e.target === e.currentTarget) {
      // Toggle the state to hide the stories component
      setShowStories(false);
    }
  };

  console.log("Social Media Links");
  console.log(socialMediaLinks);

  return (
    <div className={styles.profile}>
      <div className={styles.images}>
        {coverPhoto !== null ? (
          <img
            src={`http://localhost:5000/${coverPhoto}`}
            alt=""
            className={styles.cover}
          />
        ) : (
          <img src={img} alt="" className={styles.cover} />
        )}
        {userPhoto !== null && (
          <img
            className={styles.profilePic}
            src={`http://localhost:5000/uploads/${userPhoto}`}
            alt="Profile"
            onClick={handleUserPhotoClick}
          />
        )}

        {showStories && (
          <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.storyInfo}>
              {/* <img src="" alt="" /> */}
              <img
                src={`http://localhost:5000/${userPhoto}`}
                alt=""
                className={styles.cover}
              />
              <div className={styles.storyInfoHeader}>
                <h1>{username}</h1>
                <p>{getTimeDifferenceString(selectedStory[0].createdAt)}</p>
              </div>
            </div>
            <div className={styles.modal}>
              <Stories
                key={selectedStory.id}
                padding-top="10px"
                width="70%"
                height="97%"
                margin="auto"
                background="transparent"
                position="absolute"
                margin-top="0px"
                stories={selectedStory.map((story) => ({
                  type: "image",
                  url: story.downloadURL,
                  duration: 5000,
                }))}
                className={styles.profileStory}
              />
            </div>
          </div>
        )}

        <img className={styles.profilePic} src={userPhoto} />
        {/* <img
          className={styles.profilePic}
          src={`http://localhost:5000/${userPhoto}`}
          alt="Profile"
          onClick={handleUserPhotoClick}
        /> */}
        <img
          className={`${styles.profilePic} ${
            selectedStory && selectedStory.length > 0
              ? styles.withStoryBorder
              : ""
          }`}
          src={`http://localhost:5000/${userPhoto}`}
          alt="Profile"
          onClick={handleUserPhotoClick}
        />

        {isOwnProfile && (
          <>
            <input
              type="file"
              id="changeProfilePicInput"
              onChange={(e) => handleCoverImageUpdate(e)}
            />
            <label htmlFor="changeProfilePicInput">
              <AddAPhotoIcon className={styles.changeProfilePic} />
            </label>
          </>
        )}

        {isOwnProfile && (
          <>
            <input
              type="file"
              id="changeCoverPicInput"
              onChange={(e) => handleProfileImageUpdate(e)}
            />
            <label htmlFor="changeCoverPicInput">
              <AddAPhotoIcon className={styles.changeCoverPic} />
            </label>
          </>
        )}
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.uInfo}>
          <div className={styles.name}>
            {/* {user.map((slide, index) => ( */}
            <h1>{username}</h1>
            {/* // ))} */}
            <p className={styles.profileBio}>{bio}</p>
            <div className={styles.btn}>
              {/* {!isOwnProfile &&
                !isFriendWithCurrentUser &&
                status === "Not Accepted" && (
                  <button
                    className={styles.btn1}
                    // onClick={() => follow(senderName, username)}
                  >
                    Send Already
                  </button>
                )} */}

              {!isOwnProfile &&
                !isFriendWithCurrentUser &&
                status === "Not Found" && (
                  <button
                    className={styles.btn1}
                    onClick={() => follow(senderName, username)}
                  >
                    Follow
                  </button>
                )}

              {!isOwnProfile && status === "Accepted" && (
                <button className={styles.btn1}>Friends</button>
              )}

              {/* {!isOwnProfile &&
              !isFriendWithCurrentUser &&
              status === "Not Accepted" ? (
                <button
                  className={styles.btn1}
                  // onClick={() => follow(senderName, username)}
                >
                  Send
                </button>
              ) : (
                <button
                  className={styles.btn1}
                  onClick={() => follow(senderName, username)}
                >
                  Follow
                </button>
              )} */}

              {/* <button className={styles.btn1}>follow</button> */}
              {!isOwnProfile && (
                <button
                  className={styles.btn2}
                  onClick={handleMessageButtonClick}
                >
                  {/* <Link to={`/message/${userId}`} style={{ textDecoration: "none" }}> */}
                  message
                  {/* </Link> */}
                </button>
              )}
              {/* <button className={styles.btn2}>
                <Link to="/message/${}" style={{ textDecoration: "none" }}>
                  message
                </Link>
              </button> */}
              {/* <SettingsIcon className={styles.settings} /> */}

              {/* commented out as of no use currently  */}
              {/* <div className={styles.settings}>
                <SettingsIcon/>
              </div> */}
            </div>
          </div>

          {/* <div className={styles.links}>
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div> */}

          <div className={styles.links}>
            {socialMediaLinks.facebook && (
              <a href={socialMediaLinks.facebook}>
                <FacebookTwoToneIcon fontSize="large" />
              </a>
            )}
            {socialMediaLinks.instagram && (
              <a href={socialMediaLinks.instagram}>
                <InstagramIcon fontSize="large" />
              </a>
            )}
            {socialMediaLinks.twitter && (
              <a href={socialMediaLinks.twitter}>
                <TwitterIcon fontSize="large" />
              </a>
            )}
            {socialMediaLinks.linkedin && (
              <a href={socialMediaLinks.linkedin}>
                <LinkedInIcon fontSize="large" />
              </a>
            )}
            {socialMediaLinks.pinterest && (
              <a href={socialMediaLinks.pinterest}>
                <PinterestIcon fontSize="large" />
              </a>
            )}
          </div>

          {/* <div className={styles.right}>
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div> */}
        </div>
        <div className={styles.profileFriendsContainer}>
          <div className={styles.profileFriendsHeader}>
            <h2>{profileHeaderText}</h2>
            <button onClick={showSuggestedUsers}>Add friends </button>
          </div>
          {toggle ? (
            <div className={styles.suggestedUsers}>
              <ul>
                {/* the data below is dummy data. each user class denotes a dummy data of a single user. they are pasted multiple times. modify these to insert data dynamically - anurag c 10.1.24 */}

                <div className={styles.heading}>
                  <h2>Suggested for you</h2>
                  {/* <CloseIcon onClick={closeSuggestedUsers} className={styles.closeIcon}/> */}
                </div>

                {/* Fetching the suggestions from the state suggestion and showing in the ui */}
                <div className={styles.users}>
                  {friendSuggestion.map((suggestion, index) => (
                    <div key={index} className={styles.user}>
                      <div className={styles.userInfo}>
                        <img
                          src={`http://localhost:5000/${suggestion[0].profileImg}`}
                          alt=""
                          className={styles.userPic}
                        />
                        <h3>{suggestion[0].username}</h3>
                      </div>
                      <div className={styles.buttons}>
                        <button className={styles.btn1}>Follow</button>
                        <button className={styles.btn2}>Dismiss</button>
                      </div>
                    </div>
                  ))}
                </div>
              </ul>
            </div>
          ) : (
            <div className={styles.postOpt}></div>
          )}

          <div className={styles.profileFriends}>
            {/* friendcard div means particular friend's profile card  */}
            {uniqueFriendDetails.length > 0 ? (
              uniqueFriendDetails.map((friend, index) => (
                <div key={index} className={styles.friendCard}>
                  <div className={styles.cardImg}>
                    <a
                      style={{ textDecoration: "none" }}
                      href={`/profile/${friend.id}`}
                    >
                      <img
                        src={`http://localhost:5000/${friend.profileImg}`}
                        alt={friend.username} // Use the actual property from the friend details
                        className={styles.friendPic}
                      />
                    </a>
                  </div>
                  <div className={styles.cardName}>
                    <h3>{friend.username}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p>No Friends to show</p>
            )}
          </div>
        </div>
        {/* Post will be here */}
        <LoggedUserPosts userId={userId} />
        {/* <Posts/> */}
      </div>
    </div>
  );
};

export default Profile;
