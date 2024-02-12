import React, { useEffect, useState } from "react";
import "./saved.css";
import { Link, useParams } from "react-router-dom";

const Saved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/posts/saved_posts/${userId}`
        );
        const data = await res.json();
        console.log("Saved Posts Data:", data);
        setSavedPosts(data);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, [userId]);

  // const parseImages = (images) => {
  //   try {
  //     if (Array.isArray(images)) {
  //       return images;
  //     }

  //     const parsedImages = JSON.parse(images);

  //     return Array.isArray(parsedImages) ? parsedImages : [parsedImages];
  //   } catch (error) {
  //     console.error("Error parsing images:", error);
  //     return [];
  //   }
  // };

  const parseImages = (images) => {
    try {
      if (!images || images.length === 0) {
        return []; // Return an empty array if images is null or empty
      }
  
      if (Array.isArray(images)) {
        return images;
      }
  
      const parsedImages = JSON.parse(images);
  
      return Array.isArray(parsedImages) ? parsedImages : [parsedImages];
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  };

  return (
    <div className="savedPageContainer">
      <div className="SavedPageheader">
        <h1>Your Saved Posts</h1>
      </div>
      <div className="savedPostsContainer">
        {savedPosts.map((savedPost) => (
          <div key={savedPost._id} className="savePost">
            <div className="saveContainer">
              <div className="saveUser">
                <div className="saveUserInfo">
                  <img
                    src={`http://localhost:5000/${savedPost.userProfile}`}
                    alt=""
                  />
                  <div className="saveDetails">
                    <Link
                      to={`/profile/${savedPost.userId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <span className="saveName">{savedPost.postUsername}</span>
                    </Link>
                    <span className="saveDate">{savedPost.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="saveContent">
                <p>{savedPost.description}</p>
                {/* Render images */}
                <div className="savedPostImages">
                  {parseImages(savedPost.images).map((image, index) => {
                    const filename = JSON.parse(image)[0];
                    const imageUrl = `http://localhost:5000/uploads/${filename}`;
                    console.log("Image URL:", imageUrl);
                    return (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Saved Post ${index}`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="saveInfo">{/* Add your info icons here */}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;
