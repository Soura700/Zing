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

const Post = ({ post , userId }) => {

  const [likes, setLikes] = useState(post.likes);

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
  




  const [commentOpen, setCommentOpen] = useState(false);

  //TEMPORARY
  const liked = false;

  const [toggle, setToggle] = useState(false);

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
          <MoreHorizIcon className="icon" onClick={handleToggle}/>
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
          <img src={post.img} alt="" />
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
