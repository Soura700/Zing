import React, { useEffect, useState } from 'react';
import { Link, useInRouterContext, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../../Contexts/authContext';
import CommentSection from '../Comments/CommentSection';
import ShareModal from '../SharePostModal/SharePostModal';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import styles from '../Post/post.module.css';
import { parse } from 'uuid';

const ViewSharePost = () => {
  const { postid } = useParams(); // Extracting user ID and post ID from the URL
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [socket, setSocket] = useState(null);
  const [likes, setLikes] = useState(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [username, setUsername] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState(null);
  const parsedID = parseInt(id);

  useEffect(() => {
    
    const fetchData = async () => {
      alert("Called");
      try {
        await checkAuthentication();
        const userRes = await fetch('http://localhost:5000/api/auth/' + id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const userDetails = await userRes.json();
        console.log("User Details");
        console.log(userDetails);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/friend_request/getFriends/' + parsedID
        );
        const data = await res.json();
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchData();

    // if (id && parsedID) {
    //   Promise.all([fetchData(),fetchFriendRequests()])
    //     .then(() => setIsLoading(false))
    //     .catch((error) => console.error('Error during data fetching:', error));
    // }
  }, [id, parsedID, checkAuthentication]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/posts/get_post_by_id/${postid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const postData = await res.json();
        setPost(postData);
        setLikes(post[0].likes)
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    if (postid) {
      fetchData();
    }
  }, [post]);




  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);



  useEffect(() => {
    const socket = io('http://localhost:8000'); // Update the URL to match your server
    // Listen for 'updateLikes' event
    socket.on('updateLikes', ({ postId, updatedLikes }) => {
      if (postId === post[0].id) {
        setLikes(updatedLikes);
      }
    });
    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [post]);



  // This function os for handling the like in the realtime for the posts
  const LikeHandler = async () => {
    // Assuming you have a post ID
    const userId = parseInt(id);
    const postId = post[0].id;
    try {
      const res = await fetch('http://localhost:5000/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          userId: userId,
        }),
      });

      if (res.status === 200) {
      } else {
        console.error('Failed to update likes');
        // Handle error appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.log(error);
      console.error('Error updating likes:', error);
    }
  };

  const handleShare = async () => {
    // Call backend API to generate a link for the post
    const response = await fetch(
      `http://localhost:5000/api/posts/share_post/${post[0].id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    );
    const data = await response.json();
    setLink(data);
    // Open the modal with the generated link
    setShowModal(true);
  };



  const liked = false;

  // Your other useEffects and functions remain unchanged...

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        post && (
          <div className={styles.post}>
            <div className={styles.container}>
              <div className={styles.user}>
                <div className={styles.userInfo}>
                  <img
                    src={post.profilePic}
                    alt=''
                  />
                  <div className={styles.details}>
                    <Link
                      to={`/profile/${post.userId}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span className={styles.name}>{post[0].username}</span>
                    </Link>
                    <span className={styles.date}>1 min ago</span>
                  </div>
                </div>
                {/* Rest of your user interface components */}
              </div>
              <div className={styles.content}>
                <p>{post[0].description}</p>
                {/* Render images */}
                <div className={styles.gallery}>
                  {post.image &&
                    post.image.map((image, index) => (
                      <div
                        className={styles.imgContainer}
                        key={index}>
                        <img
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`Image ${index}`}
                          onClick={() => setShowImg(true)}
                        />
                        {/* Full image display logic */}
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
                  onClick={() => setCommentOpen(!commentOpen)}>
                  <TextsmsOutlinedIcon />
                  12 Comments
                </div>
                <div className={styles.item}>
                  <BookmarkBorderIcon />
                  Save
                </div>
                <div
                  className={styles.item}
                  onClick={handleShare}>
                  <ShareOutlinedIcon />
                  Share
                  {showModal && (
                    <ShareModal
                      link={link}
                      onClose={() => setShowModal(false)}
                    />
                  )}
                </div>
              </div>
              {commentOpen && (
                <CommentSection
                  postId={post[0].id}
                  userId={parsedID}
                  username={post[0].username}
                />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ViewSharePost;
