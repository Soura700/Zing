import { useEffect, useState } from "react";
import Post from "../Post/Post";
import styles from "./posts.module.css"
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";



const Posts = () => {

  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const [createdAt, setCreatedAt] = useState(null);
  const [postData, setPostData] = useState([]);
  const [postofFriendsData, setPostofFriendsData] = useState([]);  
  const [ friends , setFriends ] = useState([]);
  const parsedID = parseInt(id);

  useEffect(() => {

    // Fetching the data of the users (logged in)...

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
        console.log("UserDetails");
        console.log(userDetails);
        setCreatedAt(userDetails[0].createdAt);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };



// Fetching the friends of the logged user...
    const fetchFriendRequests = async () => {
      try {
        console.log(parsedID);
        const res = await fetch(
          "http://localhost:5000/api/friend_request/getFriends/" + parsedID);
        const data = await res.json();
        console.log("data");
        console.log(data);

        setFriends(data);
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
    const fetchPosts = async () => {
      try {
        const promises = friends.friends.map(async (friend) => {
          const id = friend.friendId;
          const res1 = await fetch(`http://localhost:5000/api/posts/posts_by_timestamp/${id}/${encodeURIComponent(createdAt)}`);
          return res1.json();
        });
  
        const postDataArray = await Promise.all(promises);
  
        // Filter out the error objects from the array means the objects thta have error like no posts available with status code 401
        const validPosts = postDataArray
          .reduce((acc, data) => acc.concat(data), [])
          .filter((post) => !post.error);

      // Sort the validPosts array based on the createdAt property in descending order
      const sortedPosts = validPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  
        setPostofFriendsData(sortedPosts);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchPosts();
  }, [createdAt, friends]);


  // Setting the socket
  useEffect(() => {
    const newSocket = io('http://localhost:5500');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  // Getting the posts in the realtime for the socket
  useEffect(() => {
    // Listen for new posts
    if (socket) {
      console.log('Entered');
      socket.on('newPost', ({newPost}) => {
        alert(newPost);
        console.log(newPost);
        setPostofFriendsData((prevPosts)=>[newPost,...prevPosts]);
      });
    }
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('newPost');
      }
    };
  }, [socket]);

  // console.log(postData);

  useEffect(() => {
    async function fetchPosts() {
      try {

        const postsRes = await axios.get(
          "http://localhost:5000/api/posts/allPosts"
        );

      //  console.log("Data" + postsRes.data)

       var newData = postsRes.data

        setPostData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchPosts();
  }, []);


  console.log(postofFriendsData)
  return <div className={styles.posts}>
    {/* {postofFriendsData.map(post=>(
      <Post post={post} userId={parsedID} key={post.id}/>
    ))} */}
        {postData.map(post=>(
      <Post post={post} userId={parsedID} key={post.id}/>
    ))}
  </div>;
};

export default Posts;