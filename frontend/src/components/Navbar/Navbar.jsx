import React, { useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";
import { useState } from "react";

// Toggler
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { Link } from "react-router-dom";

// import styles from  "./navbar.module.css"

// import "./navbar.css"
import styles from "./navbar.module.css"



const Navbar = ( {toggleMenu} ) => {

    const [ toggle , setToggle ] = useState(false)

    const [socket, setSocket] = useState(null);


    const { isLoggedIn, id, checkAuthentication } = useAuth();
    
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const [friendRequests,setFriendRequests] = useState([]);

    const [realTimeFriendRequests, setRealTimeFriendRequests] = useState([]);

    useEffect(() => {
      checkAuthentication().then(() => {
        setIsLoading(false); // Mark loading as complete when authentication data is available
      });
    }, [checkAuthentication]);

    useEffect(() => {
      // Initialize the Socket.IO connection when the component mounts
      const newSocket = io('http://localhost:5500');
      setSocket(newSocket);
  
      // Clean up the socket connection on component unmount
      return () => {
        newSocket.disconnect();
      };
    }, []);

      useEffect(() => {
        // Listen for 'friendRequest' event and update real-time friend requests
        if (socket) {
          alert("Entered");
          socket.on('friendRequest', ({friendRequestData , from}) => {
            alert(friendRequestData , from);
            console.log(from);
            console.log(friendRequestData);
            setRealTimeFriendRequests((prevRequests) => [friendRequestData, ...prevRequests]);
          });
        }
        // Clean up the socket event listener on component unmount
        return () => {
          if (socket) {
            socket.off('friendRequest');
          }
        };
      }, [socket]);



      
    const parsedId = parseInt(id);

    const handleToggle =  ()=> {
        setToggle(!toggle);
    }

    const [isMenuVisible, setMenuVisible] = useState(false);

  const handleIconClick = () => {
    setMenuVisible(!isMenuVisible);
  };

    // Render loading indicator if still loading authentication data
    if (isLoading) {
      return <div>Loading...</div>;
    }

  return (
    <div className={styles.navbar}>
      <div className={styles.left_navbar}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className={styles.title}>SocialMedia</span>
        </Link>

        <HomeOutlinedIcon className={styles.icon} />
        <DarkModeOutlinedIcon className={styles.icon} />
        <GridViewOutlinedIcon className={styles.icon} />

        <div className={styles.search}>
          <SearchOutlinedIcon className={styles.icon} onClick={handleToggle} />
          {toggle ? (
            <input
              type="text"
              placeholder="Search..."
              className={styles.extended}
            />
          ) : (
            <input
              type="text"
              placeholder="Search..."
              className={styles.default}
            />
          )}
        </div>

        {/* Sidebar Mneu */}

        <MenuRoundedIcon className={styles.menuIcon} onClick={toggleMenu} />

        {/* <MenuRoundedIcon className='menuIcon'  /> */}

        {/* <LeftBar isVisible={toggle} /> */}
      </div>

      <div className={styles.right_navbar}>
        <PersonOutlinedIcon onClick={handleIconClick} />
        {isMenuVisible && (
          <div className={styles.popup_menu}>
            <ul className={styles.requests}>
              {friendRequests.map((user,index)=>{

                return(
                                <li className={styles.request}>
                                <div className={styles.left}>
                                  <img
                                    className={styles.ig}
                                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                                    alt="john doe"
                                  />
                                </div>
                                <p className={styles.middle}>
                                  <span>{user.userDetails[0].username}</span>  requested to follow you
                                </p>
                
                                <div className={styles.right}>
                                  <button className={styles.acceptBtn}>Accept</button>
                                  <button className={styles.declineBtn}>Decline</button>
                                </div>
                              </li>
                );
              })}
            </ul>
          </div>
        )}
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />

        <div className={styles.user}>
          <img src="" alt="" srcset="" />
          <span>SOURA BOSE</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
