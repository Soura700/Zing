import { useEffect, useState } from "react";
import Post from "../Post/Post";
import styles from "./posts.module.css"
import axios from "axios";

import { useAuth } from "../../Contexts/authContext";



const Posts = () => {

  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Add loading state


  useEffect(() => {
    checkAuthentication().then(() => {
      setIsLoading(false); // Mark loading as complete when authentication data is available
    });
  }, [checkAuthentication]);

  const parsedId = parseInt(id);



  const [postData, setPostData] = useState([]);
  //TEMPORARY
  
  // const posts = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     userId: 1,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     userId: 2,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
  //   },
  // ];


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

  // console.log(postData);

  return <div className={styles.posts}>
    {postData.map(post=>(
      <Post post={post} userId={parsedId} key={post.id}/>
    ))}
  </div>;
};

export default Posts;