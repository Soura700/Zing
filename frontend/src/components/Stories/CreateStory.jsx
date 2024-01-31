import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Config";
import { v4 } from "uuid";

import "./CreateStory.css";

const CreateStory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  var { userId, userName } = location.state || {};

  const [formData, setFormData] = useState({
    userId: userId || "",
    userName: userName || "",
    media: "",
    downloadURL: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userId, userName, media } = formData;

    try {
      // Upload image to Firebase Storage
      const imgRef = ref(storage, `files/${v4()}`);
      await uploadBytes(imgRef, e.target.mediaFile.files[0]);

      // Get the download URL
      const downloadURL = await getDownloadURL(imgRef);

      // Update formData with the downloadURL
      setFormData({
        ...formData,
        downloadURL,
      });

      // Save user data to MongoDB (replace this with your actual MongoDB logic)
      const response = await fetch(
        "http://localhost:5000/api/stories/create_story",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            userName,
            media,
            downloadURL, // Include downloadURL in the request
          }),
        }
      );

      if (response.ok) {
        console.log("Story uploaded successfully");
        navigate("/");
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
