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
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { io } from "socket.io-client";
import CommentSection from "../Comments/CommentSection";
import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoggedUserPost = ({ post, userId }) => {
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
  const [isLiked, setIsLiked] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null); //Setting the userprofile image from the database
  const [input, setInput] = useState(""); // State variable to store the input value
  const [updatedDescription, setUpdatedDescription] = useState(null);
  // const [updatedImage,setUpdatedImage] = useState()


  const images = JSON.parse(post.image);

  const [postImages, setPostImages] = useState(images);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 4) {
      toast.error("You can select up to four images.");
      return;
    }

    // Create object URLs for the selected files
    const urls = Array.from(selectedFiles).map((file) => {
      return URL.createObjectURL(file);
    });

    // Set the object URLs and selected files in the state
    setImagePreview(selectedFiles);
    // const reader = new FileReader();
    // reader.onload = () => {
    //   setImagePreview(reader.result);
    // };
    // reader.readAsDataURL(e.target.files[0]);
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

  // const imageUrls = images.map((image) => `https://zing-media.onrender.com/uploads/${image}`);
  const liked = false;

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuthentication();
        const userRes = await fetch("https://zing-media.onrender.com/api/auth/" + id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const userDetails = await userRes.json();
        setUserPhoto(userDetails[0].profileImg); //Setting the userprofile image from the database
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const res = await fetch(
          "https://zing-media.onrender.com/api/friend_request/getFriends/" + parsedID
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

  // This is for the like system (for updating the socket)
  useEffect(() => {
    const socket = io("http://localhost:8000"); // Update the URL to match your server
    // Listen for 'updateLikes' event
    socket.on("updateLikes", ({ postId, updatedLikes }) => {
      if (postId === post.id) {
        setLikes(updatedLikes);
      }
    });
    socket.on("postUpdated", ({ postId, description, image }) => {
      if (postId == post.id) {
        setUpdatedDescription(description);
        if (image) {
          setPostImages((prevImages) => [...prevImages, image]);
          window.location.reload();
        }
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
      const res = await fetch("https://zing-media.onrender.com/api/posts/like", {
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

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `https://zing-media.onrender.com/api/posts/check_like/${post.id}/${userId}`
        );
        const data = await response.json();
        setIsLiked(data.liked);
      } catch (error) {
        // console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [post.id, userId]);

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

  // async function updatePost() {
  //   try {

  //     const formData = new FormData();
  //     formData.append("userId", parsedID);
  //     formData.append("description", input);
  //     formData.append("username", username);

  //     if (imagePreview) {
  //       Array.from(imagePreview).forEach((file, index) => {
  //         formData.append(`images`, file);
  //       });
  //     }

  //     const response = await fetch(
  //       `https://zing-media.onrender.com/api/posts/delete_post/${parsedID}/${post.id}`,
  //       {
  //         method: "PUT",
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to delete post");
  //     }
  //     const responseData = await response.json();
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //   }
  // }

  // Function to handle changes in the textarea
  const handleInputChange = (e) => {
    setInput(e.target.value); // Update the input state with the new value
  };

  async function updatePost() {
    try {
      const formData = new FormData();
      formData.append("userId", parsedID);
      formData.append("postId", post.id);
      formData.append("description", input); 
      if (imagePreview) {
        Array.from(imagePreview).forEach((file, index) => {
          formData.append(`images`, file);
        });
      }
      const response = await fetch(
        `https://zing-media.onrender.com/api/posts/update_post/${parsedID}/${post.id}`, // Update the endpoint
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      const responseData = await response.json();
      // Optionally, you can handle the response data if needed
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  async function deletePost() {
    try {
      const response = await fetch(
        `https://zing-media.onrender.com/api/posts/delete_post/${parsedID}/${post.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      const responseData = await response.json();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  return (
    <div className={styles.post}>
      <div className={styles.container}>
        <div className={styles.user}>
          <div className={styles.userInfo}>
            <img src={`https://zing-media.onrender.com/${userPhoto}`} alt="" />
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
            <MoreHorizIcon className={styles.icon} onClick={handleToggle} />
          )}
          {/* <MoreHorizIcon className="icon" onClick={handleToggle}/> */}
          {toggle ? (
            <div className={styles.postOptShow}>
              <ul>
                <li className={styles.opt1} onClick={openModal}>
                  Update Post
                </li>
                <div className={styles.opt2}>
                  <li onClick={deletePost}>Delete Post</li>
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
                <textarea
                  name="addCaption"
                  id=""
                  cols="30"
                  rows="5"
                  placeholder="Update post caption"
                  value={input}
                  onChange={handleInputChange}
                ></textarea>
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

              {imagePreview &&
                imagePreview.length > 0 &&
                Array.from(imagePreview).map((file, index) => (
                  <div className={styles.imagePreviewContainer}>
                    <button className="close-btn" onClick={handleClosePreview}>
                      <CloseRoundedIcon className="close-icon" />
                    </button>
                    {/* // <img src={imagePreview} alt="Preview" /> */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="shareImg"
                    />
                  </div>
                ))}
              <div className={styles.confirmUpdate}>
                <button className={styles.confirmUpdatePostBtn}>
                  <CheckCircleRoundedIcon
                    className={styles.confirmUpdatePostBtnIcon}
                    onClick={updatePost}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.content}>
          {/* <h3>{post.username}</h3> */}
          {updatedDescription ? (
            <p>{updatedDescription}</p>
          ) : (
            <p>{post.description}</p>
          )}
          {/* <p>{post.description}</p> */}
          {/* Render images */}
          {/* <div className={(images && images.length && images.length <= 2) ? styles.gridTwo : styles.gridMore}> */}
          <div className={styles.gallery}>
            {postImages &&
              postImages.map((image, index) => (
                <div className={styles.imgContainer} key={index}>
                  <img
                    src={`https://zing-media.onrender.com/uploads/${image}`}
                    alt={`Image ${index}`}
                    onClick={() => showPostImg(index)}
                  />
                  {selectedImageIndex === index && (
                    <div className={styles.showFullImgContainer}>
                      <h2>Preview Post</h2>
                      <div className={styles.showFullImg}>
                        <img
                          src={`https://zing-media.onrender.com/uploads/${image}`}
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
              <FavoriteOutlinedIcon onClick={LikeHandler}/>
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

export default LoggedUserPost;
