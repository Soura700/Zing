import React, { useEffect, useState } from "react";
import "./settings.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../Contexts/authContext";
import axios from "axios";

const Settings = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [userId, setUserId] = useState(null);
  const [socialMediaName, setSocialMediaName] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [socialMediaList, setSocialMediaList] = useState([]);
  const parsedID = parseInt(id);

  


  const handleAddSocialMedia = () => {
    if (socialMedia.trim() !== "") {
      setSocialMediaList([
        ...socialMediaList,
        { name: socialMediaName, url: socialMedia },
      ]);
      setSocialMedia("");
      setSocialMediaName("");
    }
  };

  const handleDeleteSocialMedia = (index) => {
    const updatedSocialMediaList = [...socialMediaList];
    updatedSocialMediaList.splice(index, 1);
    setSocialMediaList(updatedSocialMediaList);
  };

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id, parsedID, checkAuthentication]);

  const handleConfirm = () => {
    fetch("http://localhost:5000/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        bio: bio,
        userId: parsedID,
        socialMediaLinks: socialMediaList,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        toast.success("Profile Updated Successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLogout = async () => {
    alert("Called");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        window.location.href = "/login";  //On successfull redirect to the home page
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = () => {
    // Logic to delete account
  };

  return (
    <div className="settings-container">
      {/* <div className="settings-sidebar">
        <div className="sidebar-option active">Account</div>
        <div className="sidebar-option">General</div>
      </div> */}
      <div className="settings-content">
        <div className="section">
          <h2>Account Settings</h2>
          <label htmlFor="usernameID">Change Username</label>
          <input
            type="text"
            placeholder="Enter new username"
            value={userName}
            id="usernameID"
            onChange={(e) => setUserName(e.target.value)}
          />
          <label htmlFor="bioID">Update profile bio</label>
          <textarea
            placeholder="Enter new bio"
            value={bio}
            id="bioID"
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <div className="social-media">
            <h2>Update Socials</h2>
            <div className="social-media-item">
              <div className="socialInputName">
                <input
                  type="text"
                  placeholder="Social Media Name"
                  value={socialMediaName}
                  onChange={(e) => setSocialMediaName(e.target.value)}
                />
              </div>

              <input
                type="text"
                placeholder="Enter Social Media URL"
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.target.value)}
              />
              <button onClick={handleAddSocialMedia}>Add</button>
            </div>
            {socialMediaList.map((media, index) => (
              <div key={index} className="social-media-item">
                <p>
                  {media.name}: {media.url}
                </p>
                <CloseRoundedIcon
                  onClick={() => handleDeleteSocialMedia(index)}
                  className="social-media-item-icon"
                />
              </div>
            ))}
          </div>
          <button onClick={handleConfirm} className="settingsConfirmBtn">
            Confirm
          </button>
        </div>
        <hr />
        <div className="logout-section">
          <button onClick={handleLogout} className="logoutBtn">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className="deleteBtn">
            Delete Account
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Settings;
