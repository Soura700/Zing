import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useState } from "react";

// Toggler
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { Link } from "react-router-dom";

// import styles from  "./navbar.module.css"

// import "./navbar.css"
import styles from "./navbar.module.css";

const Navbar = ({ toggleMenu }) => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleIconClick = () => {
    setMenuVisible(!isMenuVisible);
  };

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
