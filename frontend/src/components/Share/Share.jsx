import {
    Close,
    EmojiEmotions,
    PermMedia,
    VideoCameraFront,
  } from "@mui/icons-material";
  import React, { useContext } from "react";
  import "./share.css";

  import { useAuth } from "../../Contexts/authContext";


  import { io } from "socket.io-client";
  import { useState, useEffect } from "react";



//   import Picker from "@emoji-mart/react";


  
  const Share = () => {

    const [socket, setSocket] = useState(null);
    const { isLoggedIn, id, checkAuthentication } = useAuth();

    const [username, setUsername] = useState(null);
    const [userPhoto, setUserPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const [input, setInput] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
  
    const [img, setImg] = useState(null);

    console.log(img);


    const parsedID = parseInt(id);

    useEffect(() => {
      const fetchData = async () => {
        try {
          await checkAuthentication();
          const userRes = await fetch("http://localhost:5000/api/auth/" + parsedID, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const userDetails = await userRes.json();
          setUsername(userDetails[0].username);
          setUserPhoto(userDetails[0].profileImg);
        } catch (error) {
          console.error("Error fetching user data:", error);
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
  

    // const [error, setError] = useState(false);
    // const { currentUser } = useContext(AuthContext);


  
    const addEmoji = (e) => {
      let sym = e.unified.split("-");
      let codesArray = [];
      sym.forEach((el) => codesArray.push("0x" + el));
      let emoji = String.fromCodePoint(...codesArray);
      setInput(input + emoji);
    };
  
    const removeImage = () => {
      setImg(null);
    };
    // console.log(currentUser);



    // const handlePost = async () => {
    //   try {
    //     // Assuming you have an API endpoint for creating a new post
    //     const response = await fetch("http://localhost:5000/api/posts/create", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         userId: id,
    //         description: input,
    //         // Add any other relevant data like images or additional details here
    //       }),
    //     });
  
    //     if (response.ok) {
    //       const result = await response.json();
    //       // You can do something with the result if needed
    //       console.log("Post created successfully:", result);
  
    //       // Emit a socket event to inform other clients about the new post
    //       socket.emit("newPost", { newPost: result });
  
    //       // Clear input and other state values if needed
    //       setInput("");
    //       setImg(null);
    //     } else {
    //       console.error("Failed to create post");
    //       // Handle error scenarios
    //     }
    //   } catch (error) {
    //     console.error("Error creating post:", error);
    //     // Handle network or other errors
    //   }
    // };


    const handlePost = async () => {
      try {
        // Create a new FormData object
        const formData = new FormData();
    
        // Append text data
        formData.append("userId", id);
        formData.append("description", input);
    
        // Append file data
        if (img) {
          formData.append("images", img);
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
          socket.emit("newPost", { newPost: result });
    
          // Clear input and other state values if needed
          setInput("");
          setImg(null);
        } else {
          console.error("Failed to create post");
          // Handle error scenarios
        }
      } catch (error) {
        console.error("Error creating post:", error);
        // Handle network or other errors
      }
    };
    


    return (
      <div className="share">
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
            Post
          </button>
        </div>
          </div>
          <hr className="shareHr" />
          {img && (
            <div className="shareImgContainer">
              <img src={URL.createObjectURL(img)} alt="" className="shareImg" />
              <Close className="shareCancelImg" onClick={removeImage} />
            </div>
          )}
          <div className="shareBottom">
            <div className="shareOptions">
              <div className="shareOption">
                <VideoCameraFront
                  className="shareIcon"
                  style={{ color: "#bb0000f2" }}
                />
                <span className="shareOptionText">Live Video</span>
              </div>
              <label htmlFor="file" className="shareOption">
                <PermMedia className="shareIcon" style={{ color: "#2e0196f1" }} />
                <span className="shareOptionText">Media</span>
                <input
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const selectedFiles = e.target.files[0];
                    setImg(e.target.files[0])
                  }}
                />
              </label>
              <div
                onClick={() => setShowEmojis(!showEmojis)}
                className="shareOption"
              >
                <EmojiEmotions
                  className="shareIcon"
                  style={{ color: "#bfc600ec" }}
                />
                <span className="shareOptionText">Feelings/Activity</span>
              </div>
            </div>
          </div>
          {showEmojis && (
            <div className="emoji">
              {/* <Picker onEmojiSelect={addEmoji} /> */}
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

