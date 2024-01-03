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

    const { isLoggedIn, id, checkAuthentication } = useAuth();
    
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const [friendRequestNotifications, setFriendRequestNotifications] = useState([]);
    const [friendRequestNotificationsName,setFriendRequestNotificationsName] = useState([]);
    const [friendRequests,setFriendRequests] = useState([]);
    


    useEffect(() => {
      checkAuthentication().then(() => {
        setIsLoading(false); // Mark loading as complete when authentication data is available
      });
    }, [checkAuthentication]);

    

    const parsedId = parseInt(id);

    

    // Socket connection....
    useEffect(() => {
        const socket = io('http://localhost:5500'); // Update the URL to match your server
        // Listen for 'updateLikes' event
        socket.on('sendRequest', async ({from}) => {
            console.log(from);
            setFriendRequestNotifications(from);
                // const fetchData = async () => {
                  const res = await fetch("http://localhost:5000/api/auth/", + from);
                  const data = await res.json();
                  setFriendRequestNotificationsName(data);
                  console.log("Data" + data);
                // };            
            // console.log(friendRequestNotifications);
        });
    
        // Clean up the socket connection on component unmount
        return () => {
          socket.disconnect();
        };
      }, []);


      // Fetching the freinds requests
      
      useEffect(() => {
        const fetchData = async () => {
          const res = await fetch("http://localhost:5000/api/friendrequest/getRequests", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // userId: id
              
              userId:3 //Problem
            }),
          });
          const data = await res.json();
          console.log(data);
      
          // Create an array to store promises of fetching user details
          const userDetailPromises = data.map(async (friendRequest) => {
            const userRes = await fetch("http://localhost:5000/api/auth/" + friendRequest.from ,{
              method:"POST",
              headers:{
                "Content-Type": "application/json",
              }
            });
            const userData = await userRes.json();
            console.log("UserData" + userData);
            console.log(userData)
            return {
              ...friendRequest,
              userDetails: userData,
            };
          });
      
          // Wait for all promises to resolve
          const friendRequestsWithDetails = await Promise.all(userDetailPromises);
      
          // Set the state with friend requests and user details
          

          setFriendRequests(friendRequestsWithDetails);
        };
      
        fetchData();
      }, []);
      


      console.log(friendRequests);

      // if(friendRequestNotifications){
      //   alert("present");
      //   console.log(setFriendRequestNotificationsName);
      // }else if (!friendRequestNotifications){
      //   alert("Not present")
      // }
      


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
              {/* <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>{}</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li>

              <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>John Doe</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li>

              <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>John Doe</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li>

              <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>John Doe</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li>

              <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>John Doe</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li>


              <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>John Doe</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li>

              <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>John Doe</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li>

              <li className={styles.request}>
                <div className={styles.left}>
                  <img
                    className={styles.ig}
                    src="https://images.pexels.com/photos/19555765/pexels-photo-19555765/free-photo-of-portrait-of-egret-bird.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="john doe"
                  />
                </div>
                <p className={styles.middle}>
                  <span>John Doe</span>  requested to follow you
                </p>

                <div className={styles.right}>
                  <button className={styles.acceptBtn}>Accept</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </li> */}
         

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
