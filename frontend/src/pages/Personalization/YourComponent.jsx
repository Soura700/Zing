import React, { useState } from "react";
import "./YourComponent.css"; // Import your CSS file
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const YourComponent = () => {
  const {userId} = useParams();


  const [selectedInterests, setSelectedInterests] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState("");

  const [selectedImage, setSelectedImage] = useState(
    "https://previews.123rf.com/images/alekseyvanin/alekseyvanin1807/alekseyvanin180701556/104886082-add-user-outline-icon-linear-style-sign-for-mobile-concept-and-web-design-follower-user-simple-line.jpg"
  );
  

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);

      // Create a URL for the selected image and set it in the state
  const imageURL = URL.createObjectURL(file);
  setSelectedImage(imageURL);


  };

  // Handling the interests edge case
  const handleOptionClick = (interest) => {
    const isSelected = selectedInterests.includes(interest);

    if (isSelected) {
      // Deselect the interest
      setSelectedInterests((prevInterests) =>
        prevInterests.filter((i) => i !== interest)
      );
    } else {
      // Select the interest
      setSelectedInterests((prevInterests) => [...prevInterests, interest]);
    }
  };




  // Selecting the interests and hadling the edge cases 

  const handleConfirmClick = () => {
    const selectedCount = selectedInterests.length;

    if (selectedCount >= 2) {
      
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      formData.append("bio", bio);
      formData.append("interests", JSON.stringify(selectedInterests));
      formData.append("userId" , userId);

      fetch("http://localhost:5000/api/bio_profile_img/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Handle the response as needed
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });

        // Store the interests in the mongodb 
        // Store interests in MongoDB

    fetch('http://localhost:5000/api/user/sendInterest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        userInterest: selectedInterests,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle the response as needed
      })
      .catch((error) => {
        console.log(error);
        console.error('Error storing interests:', error);
      });

      // alert("Confirmed!");

      toast.success("Confirmed!");

    } else {
      // alert("Please select two or more choices");

      toast.error("Please select two or more choices");
    }
  };



  return (
    <body className="yourComponentBody">
     <div className="whole">
      <header>
        <h1>Hi John Doe,</h1>
        <h2>Personalize your Profile</h2>
      </header>
      <section id="profile">
            <div id="profilePic">
              <h2>Setup your profile picture</h2>
              <label htmlFor="fileInput">
                <div className="image-container">
                  <img src={selectedImage} alt="profileImg"></img>
                  {/* <img  src="https://previews.123rf.com/images/alekseyvanin/alekseyvanin1807/alekseyvanin180701556/104886082-add-user-outline-icon-linear-style-sign-for-mobile-concept-and-web-design-follower-user-simple-line.jpg" alt="" />  */}
                  {/* + */}
                </div>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <span></span>
        </div>
        <div id="profileBio" placeholder="Bio" className="auto-size-text-box" contenteditable="true" onInput={(e)=>setBio(e.target.innerText)} >
          {/* <input
          className="input-box"
            type="text"
            name=""
            id=""
            
            placeholder="Write about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          /> */}
        </div>
      </section>
      <div id="interests">
        <h2>Tell us more about your interests</h2>
        <h4>Pick 2 or more of what you like</h4>
        <div id="interestsList">
          <ul>
            {[
              'Art', 'Photography', 'Travelling', 'Gym', 'Reading', 'Coding', 'Gaming', 'Food', 'Yoga', 'Singing', 'Design', 'Football', 'Cricket', 'Tennis', 'Basketball',
            ].map((interest, index) => (
              <li
                key={index}
                className={
                  selectedInterests.includes(interest) ? "selected" : ""
                }
                onClick={() => handleOptionClick(interest)}
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
        <div id="btn">
          <button type="button" id="ConfirmBtn" onClick={handleConfirmClick}>
            Confirm
          </button>
        </div>
      </div>
    </div>
    <ToastContainer/>
  </body>
  );
};

export default YourComponent;