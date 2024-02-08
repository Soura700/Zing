import styles from "./post.module.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import Comments from "../comments/Comments";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/authContext";

const LoggedUserPost = ({ post, userId }) => {
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const parsedID = parseInt(id);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleClosePreview = () => {
    // Reset image preview
    setImagePreview(null);
    // Reset file input if it exists
    const fileInput = document.getElementById("mediaFile");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Parse the JSON string into an array
  const images = JSON.parse(post.image);

  console.log(typeof images);

  // const imageUrls = images.map((image) => `http://localhost:5000/uploads/${image}`);
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
        // setUsername(userDetails[0].username);
        // setUserPhoto(userDetails[0].profileImg);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        console.log(parsedID);
        const res = await fetch(
          "http://localhost:5000/api/friend_request/getFriends/" + parsedID
        );
        const data = await res.json();
        // console.log(data);
        // console.log(typeof data);

        // setFriendRequests(data);
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
    const socket = io("http://localhost:5500"); // Update the URL to match your server

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
      console.log(error);
      console.error("Error updating likes:", error);
    }
  };

  //Post Option toggle
  const handleToggle = () => {
    setToggle(!toggle);
  };

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
              <span className={styles.date}>
                {getTimeDifferenceString(post.createdAt)}
              </span>
            </div>
          </div>
          {userId === post.userId && (
            <MoreHorizIcon className= {styles.icon} onClick={handleToggle} />
          )}
          {/* <MoreHorizIcon className="icon" onClick={handleToggle}/> */}
          {toggle ? (
            <div className={styles.postOptShow}>
              <ul>
                <li className={styles.opt1} onClick={openModal}>
                  Update Post
                </li>
                <div className={styles.opt2}>
                  <li>Delete Post</li>
                </div>
              </ul>
            </div>
          ) : (
            <div className={styles.postOpt}></div>
          )}

          {isModalOpen && (
            <div className={styles.updatePostModal}>
              <div className={styles.modalHeader}>
                <h2>Update Post</h2>
                <CloseIcon onClick={closeModal} />
              </div>
              <div className={styles.updatePostContent}>
                <textarea name="addCaption" id="" cols="30" rows="5" placeholder="Update post caption"></textarea>
                <label htmlFor="addMedia">
                  <p>Add Media</p>
                  <AddPhotoAlternateRoundedIcon
                    className={styles.updatePostAddPic}
                  />
                </label>
                <input
                  type="file"
                  name="mediaFile"
                  accept="image/*, video/*"
                  onChange={handleFileChange}
                  required
                  id="addMedia"
                />
              </div>
              {imagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <button className="close-btn" onClick={handleClosePreview}>
                    <CloseRoundedIcon className="close-icon" />
                  </button>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              <div className={styles.confirmUpdate}>
                <button className={styles.confirmUpdatePostBtn}>
                  <CheckCircleRoundedIcon
                    className={styles.confirmUpdatePostBtnIcon}
                  />
                </button>
              </div>
            </div>
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
        {/* {commentOpen && <Comments />} */}
      </div>
    </div>
  );
};

export default LoggedUserPost;
