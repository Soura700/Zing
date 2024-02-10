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
import ShareModal from "../SharePostModal/SharePostModal";

const Post = ({ post, userId, style }) => {

  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Setting the loading
  const [likes, setLikes] = useState(post.likes);
  const [commentOpen, setCommentOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const parsedID = parseInt(id);
  const [showImg, setShowImg] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const images = post.image === null ? JSON.parse(post.image) : [];

  const images = Array.isArray(post.image)
    ? post.image
    : post.image && post.image !== "[]"
    ? JSON.parse(post.image)
    : [];
  const liked = false;



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
        // console.error("Error fetching user data:", error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/friend_request/getFriends/" + parsedID
        );
        const data = await res.json();
      } catch (error) {
        // console.error("Error fetching friend requests:", error);
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

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts/check_like/${post.id}/${userId}`
        );
        const data = await response.json();
        setIsLiked(data.liked);
      } catch (error) {
        // console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [post.id, userId]);

  // This is for the like system (for updating the socket)
  useEffect(() => {
    const socket = io("http://localhost:8000"); // Update the URL to match your server

    // Listen for 'updateLikes' event
    socket.on("updateLikes", ({ postId, updatedLikes }) => {
      if (postId === post.id) {
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
        setIsLiked(!isLiked);
      } else {
        // console.error("Failed to update likes");
        // Handle error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      // console.error("Error updating likes:", error);
    }
  };

     useEffect(() => {
     // Fetch information about saved posts when the component mounts
     const fetchSavedPosts = async () => {
       try {
         const res = await fetch(
           `http://localhost:5000/api/posts/saved_posts/${userId}`
         );
         const data = await res.json();
         setSavedPosts(data);

         // Check if the current post is in the savedPosts state
         const isPostSaved = data.some(
           (savedPost) => savedPost.postId === post.id
         );
         setIsSaved(isPostSaved);
       } catch (error) {
         console.error("Error fetching saved posts:", error);
       }
     };

     fetchSavedPosts();
   }, [userId, post.id]);

const savePost = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/posts/save_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: parsedID,
        postId: post.id,
        postUsername: post.name,
        description: post.description,
        images: post.image,
      }),
    });

    if (res.status === 201) {
      // Update the savedPosts state and set isSaved to true
      setSavedPosts([...savedPosts, { postId: post.id }]);
      setIsSaved(true);
      alert(`UserId of the post: ${userId}`);
    } else {
      console.error("Failed to save post");
    }
  } catch (error) {
    console.log(error);
    console.error("Error saving post:", error);
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
    } else if (timeDifferenceHours < 24) {
      return `${timeDifferenceHours} hours ago`;
    } else {
      return `${timeDifferenceDays} days ago`;
    }
  };

  const handleShare = async () => {
    // Call backend API to generate a link for the post
    const response = await fetch(
      `http://localhost:5000/api/posts/share_post/${post.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    const data = await response.json();
    setLink(data);
    // Open the modal with the generated link
    setShowModal(true);
  };

  return (
    <div className={styles.post} style={style}>
      <div className={styles.container}>
        <div className={styles.user}>
          <div className={styles.userInfo}>
            <img src={post.profilePic} alt="" />
            <div className={styles.details}>
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className={styles.name}>{post.username}</span>
              </Link>
              <span className={styles.date}>
                {getTimeDifferenceString(post.createdAt)}
              </span>
            </div>
          </div>
          {userId === post.userId && (
            <MoreHorizIcon className="icon" onClick={handleToggle} />
          )}
          {/* <MoreHorizIcon className="icon" onClick={handleToggle}/> */}
          {toggle ? (
            <div className={styles.postOptShow}>
              <ul>
                <button className={styles.opt1} onClick={openModal}>
                  Update Post
                </button>
                <div className={styles.opt2}>
                  <li>De Post</li>
                </div>
              </ul>
            </div>
          ) : (
            <div className={styles.postOpt}></div>
          )}

          {isModalOpen && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Update Post</h2>
                <button onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.content}>
          {/* <h3>{post.username}</h3> */}
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
            {isLiked ? (
              <FavoriteOutlinedIcon onClick={LikeHandler} />
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
{/*           <div className={styles.item}>
            <BookmarkBorderIcon />

          </div> */}
          <div
            className={styles.item}
            onClick={() => 
              savePost()}
            
          >
            {isSaved ? (
              <BookmarkBorderIcon style={{ color: "red" }} />
            ) : (
              <BookmarkBorderIcon />
            )}
            Save
          </div>
          <div className={styles.item} onClick={handleShare}>
            <ShareOutlinedIcon />
            {showModal && (
              <ShareModal link={link} onClose={() => setShowModal(false)} />
            )}
          </div>
        </div>
        {commentOpen && (
          <CommentSection
            postId={post.id}
            userId={parsedID}
            userName={post.username}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
