// import React from "react";
// import "./saved.css";
// const Saved = () => {
//   return (
//     <>
//       <div className="savedPageContainer">
//         <div className="SavedPageheader">
//           <h1>Your Saved Posts</h1>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Saved;


import React, { useEffect, useState } from "react";
import "./saved.css";
import { useParams } from "react-router-dom";

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

  const parseImages = (images) => {
    try {
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
          <div key={savedPost._id} className="savedPostContainer">
            <div className="savedPostDetails">
              <p>User ID: {savedPost.userId}</p>
              <p>Post ID: {savedPost.postId}</p>
              <p>Post Username: {savedPost.postUsername}</p>
              <p>Description: {savedPost.description}</p>
            </div>
            {savedPost.images && savedPost.images.length > 0 && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;
