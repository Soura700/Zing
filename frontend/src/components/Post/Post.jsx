import styles from "./post.module.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
// import Comments from "../comments/Comments";
import { useState } from "react";

const Post = ({ post }) => {


  console.log("Post" + post);
  console.log(post.description);




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
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            13 Likes
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
