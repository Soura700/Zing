import styles from "./post.module.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";

import { Link } from "react-router-dom";
// import Comments from "../comments/Comments";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import CommentSection from "../Comments/CommentSection";

const Post = ({ post, userId }) => {
  console.log(post);

  if (post.image) {
    console.log("Entered");
    console.log(post.image);
    console.log(typeof post.image);
  }

  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Setting the loading
  const [likes, setLikes] = useState(post.likes);
  const [commentOpen, setCommentOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const parsedID = parseInt(id);
  const [showImg, setShowImg] = useState(false);

  // const images = post.image === null ? JSON.parse(post.image) : [];

  const images = Array.isArray(post.image)
    ? post.image
    : post.image && post.image !== "[]"
    ? JSON.parse(post.image)
    : [];
  const liked = false;

  console.log("Posts");
  console.log(post);

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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/friend_request/getFriends/" + parsedID
        );
        const data = await res.json();
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    if (id && parsedID) {
      Promise.all([fetchData(), fetchFriendRequests()])
        .then(() => setIsLoading(false))
        .catch((error) => console.error("Error during data fetching:", error));
    }
  }, [id, parsedID, checkAuthentication]);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // This is for the like system (for updating the socket)
  useEffect(() => {
    const socket = io("http://localhost:8000"); // Update the URL to match your server

    // Listen for 'updateLikes' event
    socket.on("updateLikes", ({ postId, updatedLikes }) => {
      if (postId === post.id) {
        alert("Hello");
        alert(updatedLikes);
        setLikes(updatedLikes);
      }
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [post.id]);

  // This function os for handling the like in the realtime for the posts
  const LikeHandler = async () => {
    // Assuming you have a post ID
    const postId = post.id;
    try {
      const res = await fetch("http://localhost:5000/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          userId: userId,
        }),
      });

      if (res.status === 200) {
      } else {
        console.error("Failed to update likes");
        // Handle error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  //Post Option toggle
  const handleToggle = () => {
    setToggle(!toggle);
  };
  // const showPostImg = () => {
  //   setShowImg(!showImg);
  // };

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const showPostImg = (index) => {
    setSelectedImageIndex(index);
  };

  const closeFullImg = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction) => {
    if (selectedImageIndex !== null) {
      const newIndex =
        direction === "next"
          ? (selectedImageIndex + 1) % images.length
          : (selectedImageIndex - 1 + images.length) % images.length;
      setSelectedImageIndex(newIndex);
    }
  };

  const getTimeDifferenceString = (timestamp) => {
    const currentDate = new Date();
    const timestampDate = new Date(timestamp);
    const timeDifferenceMilliseconds = currentDate - timestampDate;
    const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);

  
    if (timeDifferenceSeconds < 60) {
      return `${timeDifferenceSeconds} seconds ago`;
    } else if (timeDifferenceMinutes < 60) {
      return `${timeDifferenceMinutes} minutes ago`;
    }else if (timeDifferenceHours < 24) {
      return `${timeDifferenceHours} hours ago`;
    }else{
      return `${timeDifferenceDays} days ago`;
    }
  };

  return (
    <div className={styles.post}>
      <div className={styles.container}>
        <div className={styles.user}>
          <div className={styles.userInfo}>
            <img src={post.profilePic} alt="" />
            <div className={styles.details}>
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className={styles.name}>{post.name}</span>
              </Link>
              <span className={styles.date}>{getTimeDifferenceString(post.createdAt)}</span>
            </div>
          </div>
          {userId === post.userId && (
            <MoreHorizIcon className="icon" onClick={handleToggle} />
          )}
          {/* <MoreHorizIcon className="icon" onClick={handleToggle}/> */}
          {toggle ? (
            <div className={styles.postOptShow}>
              <ul>
                <li className={styles.opt1}>Update Post</li>
                <div className={styles.opt2}>
                  <li>Delete Post</li>
                </div>
              </ul>
            </div>
          ) : (
            <div className={styles.postOpt}></div>
          )}
        </div>
        <div className={styles.content}>
        <h3>{post.username}</h3>
          <p>{post.description}</p>
          {/* Render images */}
          {/* <div className={(images && images.length && images.length <= 2) ? styles.gridTwo : styles.gridMore}> */}
          <div className={styles.gallery}>
            {images &&
              images.map((image, index) => (
                <div className={styles.imgContainer} key={index}>
                  <img
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={`Image ${index}`}
                    onClick={() => showPostImg(index)}
                  />
                  {selectedImageIndex === index && (
                    <div className={styles.showFullImgContainer}>
                      <h2>Preview Post</h2>
                      <div className={styles.showFullImg}>
                      <img
                        src={`http://localhost:5000/uploads/${image}`}
                        alt={`Image ${index}`}
                        onClick={() => showPostImg(index)}
                      />
                      {/* Add the full-size image or any other content here */}
                      <button
                        onClick={() => navigateImage("prev")}
                        className={styles.prevImgBtn}
                      >
                        <KeyboardArrowLeftIcon />{" "}
                      </button>
                      <button
                        onClick={() => navigateImage("next")}
                        className={styles.nextImgBtn}
                      >
                        <KeyboardArrowRightIcon />
                      </button>
                      <button
                        onClick={closeFullImg}
                        className={styles.closeImgBtn}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.item}>
            {liked ? (
              <FavoriteOutlinedIcon />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={LikeHandler} />
            )}
            {likes}
          </div>
          <div
            className={styles.item}
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <TextsmsOutlinedIcon />
            {/* 12 Comments */}
          </div>
          <div className={styles.item}>
            <BookmarkBorderIcon />
            {/* Save */}
          </div>
          <div className={styles.item}>
            <ShareOutlinedIcon />
            {/* Share */}
          </div>
        </div>
        {commentOpen && <CommentSection postId={post.id} userId={parsedID} userName={post.username}/>}
      </div>
    </div>
  );
};

export default Post;
