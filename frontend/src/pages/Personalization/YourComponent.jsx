import React, { useState } from "react";
import "./YourComponent.css"; // Import your CSS file

const YourComponent = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState("");

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

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

  const handleConfirmClick = () => {
    const selectedCount = selectedInterests.length;

    if (selectedCount >= 2) {
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      formData.append("bio", bio);
      formData.append("interests", JSON.stringify(selectedInterests));

      fetch("http://localhost:3001/upload", {
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

      alert("Confirmed!");
    } else {
      alert("Please select two or more choices");
    }
  };

  return (
    <div>
      <header>
        <h1>Hi John Doe,</h1>
        <h2>Personalize your Profile</h2>
      </header>
      <section id="profile">
        <div id="profilePic">
          <h2>Setup your profile picture</h2>
          <label htmlFor="fileInput">
            <div className="image-container">
              {profilePicture ? (
                <img src={URL.createObjectURL(profilePicture)} alt="Profile" />
              ) : (
                <div className="add-icon">+</div>
              )}
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
        <div id="profileBio">
          <input
            type="text"
            name=""
            id=""
            placeholder="Write about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
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
  );
};

export default YourComponent;
