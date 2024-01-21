import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router Navigate
import { useLocation } from "react-router-dom";
import "./CreateStory.css";

const CreateStory = () => {
  const location = useLocation();

  const navigate = useNavigate(); // Initialize navigate from React Router Navigate

  var { userId, userName, clicked } = location.state || {};

  console.log(userId + userName);

  const parsedId = parseInt(userId);

  const [formData, setFormData] = useState({
    userId: userId || "", // Use the passed userId, if available
    userName: userName || "", // Use the passed userName, if available
    media: "", // 'photo' or 'video'
    mediaFile: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      mediaFile: e.target.files[0],
    });

    // Preview the uploaded image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userId, userName, media, mediaFile } = formData;

    const storyData = new FormData();
    storyData.append("userId", userId);
    storyData.append("userName", userName);
    storyData.append("media", media);
    storyData.append("mediaFile", mediaFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/stories/create_story",
        {
          method: "POST",
          body: storyData,
          // body: JSON.stringify({
          //     storyData,
          //     userId:parsedId,
          //     userName: userName,
          //   }),
        }
      );

      if (response.ok) {
        console.log("Story uploaded successfully");
        // Redirect to the home page using navigate
        navigate("/");
        // Reload the page
        window.location.reload();
      } else {
        console.error("Failed to upload story");
      }
    } catch (error) {
      console.error("Error uploading story:", error.message);
    }
  };

  return (
    <div className="create-story-container">
      <h2>Create Story</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Media Type (photo or video):
          <input
            type="text"
            name="media"
            value={formData.media}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Upload Media:
          <input
            type="file"
            name="mediaFile"
            accept="image/*, video/*"
            onChange={handleFileChange}
            required
          />
        </label>
        <br />
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
        <br />
        <button type="submit">Upload Story</button>
      </form>
    </div>
  );
};

export default CreateStory;
