import styles from "./post.module.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
// import Comments from "../comments/Comments";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/authContext";


const Post = ({ post , userId }) => {

  console.log(post);

  if(post.image){
    console.log("Entered");
    console.log(post.image)
    console.log(typeof post.image)
  }

  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Setting the loading
  const [likes, setLikes] = useState(post.likes);
  const [commentOpen, setCommentOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const parsedID = parseInt(id);

  
  // Parse the JSON string into an array
  const images =  JSON.parse(post.image);


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
          "http://localhost:5000/api/friend_request/getFriends/" + parsedID);
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
    const newSocket = io("http://localhost:5500");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


// This is for the like system (for updating the socket)
  useEffect(() => {
    const socket = io('http://localhost:5500'); // Update the URL to match your server

    // Listen for 'updateLikes' event
    socket.on('updateLikes', ({ postId, updatedLikes }) => {
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
              <span className={styles.date}>1 min ago</span>
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
          <p>{post.description}</p>
          {/* Render images */}
          {/* <div className={(images && images.length && images.length <= 2) ? styles.gridTwo : styles.gridMore}> */}
          {/* <div className={styles.imageContainer}> */}
            {images && images.map((image, index) => (
              console.log(image),
              <img key={index} src={`http://localhost:5000/uploads/${image}`} alt={`Image ${index}`} />
            ))}
        {/* </div> */}
        </div>
        <div className={styles.info}>
          <div className={styles.item}>
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon onClick={LikeHandler} />}
            {likes}
          </div>
          <div
            className={styles.item}
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className={styles.item}>
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {/* {commentOpen && <Comments />} */}
      </div>
    </div>
  );
};

export default Post;
