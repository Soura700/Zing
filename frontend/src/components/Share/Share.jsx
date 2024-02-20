import {
  Close,
  EmojiEmotions,
  PermMedia,
  VideoCameraFront,
} from "@mui/icons-material";
import React, { useContext } from "react";
import "./share.css";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../Contexts/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";

import EmojiPicker from 'emoji-picker-react';
// Function to check text toxicity
const checkTextToxicity = async (description) => {
  // Load the toxicity model
  const model = await toxicity.load();

  // Classify the description text for toxicity
  const predictions = await model.classify(description);

  // Check if any toxic predictions exceed the threshold
  for (const prediction of predictions) {
    if (prediction.results[0].match) {
      // If toxicity is detected, return true
      return true;
    }
  }

  // If no toxicity detected, return false
  return false;
};

const Share = ({styles}) => {
  const [socket, setSocket] = useState(null);
  const { isLoggedIn, id, checkAuthentication } = useAuth();

  const [username, setUsername] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const [imgUrls, setImgUrls] = useState([]);

  const [img, setImg] = useState(null);

  const parsedID = parseInt(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuthentication();
        const userRes = await fetch(
          "http://localhost:5000/api/auth/" + parsedID,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const userDetails = await userRes.json();
        setUsername(userDetails[0].username);
        setUserPhoto(userDetails[0].profileImg);
      } catch (error) {
        // console.error("Error fetching user data:", error);
      }
    };

    if (id && parsedID) {
      Promise.all([fetchData()])
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

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  const removeImage = (index) => {
    const updatedImages = [...img];
    updatedImages.splice(index, 1);
    setImg(updatedImages);
  };

  // const handleImageChange = (e) => {
  //   const selectedFiles = e.target.files;
  //   const urls = Array.from(selectedFiles).map((file) =>
  //     URL.createObjectURL(file)
  //   );
  //   setImgUrls(urls);
  //   setImg(selectedFiles);
  // };

  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 4) {
      // Show toast notification for exceeding maximum image selection
      toast.error("You can select up to four images.");
      return;
    }
    const urls = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setImgUrls(urls);
    setImg(selectedFiles);
  };

  // const handlePost = async () => {
  //   try {
  //     const formData = new FormData();
  //     // Append text data
  //     formData.append("userId", id);
  //     formData.append("description", input);
  //     formData.append("username", username);

  //     if (img) {
  //       Array.from(img).forEach((file, index) => {
  //         formData.append(`images`, file);
  //       });
  //     }
  //     // Assuming you have an API endpoint for creating a new post
  //     const response = await fetch("http://localhost:5000/api/posts/create", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       // You can do something with the result if needed
  //       console.log("Post created successfully:", result);

  //       // Emit a socket event to inform other clients about the new post
  //       socket.emit("newPost", { newPost: result , userId:id });

  //       // Clear input and other state values if needed
  //       setInput("");
  //       setImg(null);
  //       toast("Post created successfully");
  //     } else {
  //       console.error("Failed to create post");
  //       const errorData = await response.json();
  //       if (response.status === 400 && errorData.error) {
  //         // Display toast notification for 18+ content error
  //         toast.error(errorData.error);
  //       } else {
  //         console.error("Failed to create post");
  //       }
  //       // Handle error scenarios
  //     }
  //   } catch (error) {
  //     console.error("Error creating post:", error);
  //   }
  // };

  const handlePost = async () => {
     // Check text toxicity before posting
     const isToxic = await checkTextToxicity(input);

     if (isToxic) {
       // If text is toxic, display error message and prevent posting
       toast.error(
         "Your post contains toxic content. Please revise your message."
       );
       return;
     }

     // Proceed with posting if text is not toxic
     try {
       const formData = new FormData();
       // Append text data
       formData.append("userId", id);
       formData.append("description", input);
       formData.append("username", username);

       if (img) {
         Array.from(img).forEach((file, index) => {
           formData.append(`images`, file);
         });
       }
       // Assuming you have an API endpoint for creating a new post
       const response = await fetch("http://localhost:5000/api/posts/create", {
         method: "POST",
         body: formData,
       });

       if (response.ok) {
         const result = await response.json();
         // You can do something with the result if needed
         console.log("Post created successfully:", result);

         // Emit a socket event to inform other clients about the new post
         socket.emit("newPost", { newPost: result, userId: id });

         // Clear input and other state values if needed
         setInput("");
         setImg(null);
         toast("Post created successfully");
       } else {
         const errorData = await response.json();
         if (response.status === 400 && errorData.error) {
           // Display toast notification for 18+ content error
           toast.error(errorData.error);
         } else {
           console.error("Failed to create post");
         }
       }
     } catch (error) {
       console.error("Error creating post:", error);
     }
   };

  return (
    <div className="share" style={styles}>
      <div className="shareWrapper">
        <div className="shareTop">
          <img src={userPhoto} alt="" className="shareProfileImg" />
          {/* The image url in thw above line should be given dynamically */}
          <input
            type="text"
            rows={2}
            style={{ resize: "none", overflow: "hidden" }}
            placeholder={"What's on your mind " + username + "?"}
            value={input}
            className="shareInput"
            onChange={(e) => setInput(e.target.value)}
            //   onKeyDown={handleKey}
          />
          <div className="shareIcon">
            {/* ... (Your existing JSX) */}
            <button className="shareButton" onClick={handlePost}>
              <SendIcon className="shareButtonIcon" />
            </button>
          </div>
        </div>
        <hr className="shareHr" />
        {/* {img && (
            <div className="shareImgContainer">
              <img src={URL.createObjectURL(img)} alt="" className="shareImg" />
              <Close className="shareCancelImg" onClick={removeImage} />
            </div>
          )} */}
        {/* {img && (
          <div>
            {img.map((file, index) => (
              <div className="shareImgContainer" key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="shareImg"
                />
                <Close
                  className="shareCancelImg"
                  onClick={() => removeImage(index)}
                />
              </div>
            ))}
          </div>
        )} */}
        {img && img.length > 0 && (
          <div className="sharePicSection">
            {Array.from(img).map((file, index) => (
              <div className="shareImgContainer" key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="shareImg"
                />
                <Close
                  className="shareCancelImg"
                  onClick={() => removeImage(index)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="shareBottom">
          <div className="shareOptions">
            {/* <div className="shareOption">
              <VideoCameraFront
                className="shareIcon"
                // style={{ color: "#bb0000f2" }}
              />
              <span className="shareOptionText">Live Video</span>
            </div> */}
            <label htmlFor="file" className="shareOption">
              <PermMedia
                className="shareIcon"
                // style={{ color: "#2e0196f1" }}
              />
              <span className="shareOptionText">Media</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                style={{ display: "none" }}
                multiple
                // onChange={(e) => {
                //   // const selectedFiles = e.target.files[0];
                //   const selectedFiles = e.target.files;
                //   console.log("Selected Files");
                //   console.log(selectedFiles);
                //   setImg(selectedFiles);
                //   // setImg(e.target.files[0])
                // }}
                onChange={handleImageChange}
              />
            </label>
            <div
              onClick={() => setShowEmojis(!showEmojis)}
              className="shareOption"
            >
              <EmojiEmotions
                className="shareIcon"
                // style={{ color: "#bfc600ec" }}
              />
              <span className="shareOptionText">Activity</span>
            </div>
          </div>
        </div>
        {showEmojis && (
          <div className="emoji">
          <EmojiPicker onEmojiClick={addEmoji}/>
          </div>
        )}
        {/* <div className="shareBottom">
          
          <button className="shareButton" onClick={handlePost}>
            Post
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Share;


