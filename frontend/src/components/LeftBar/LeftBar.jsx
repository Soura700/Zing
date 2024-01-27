import React from "react";
import "./leftBar.module.css";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MessageIcon from "@mui/icons-material/Message";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "./leftBar.module.css";
import { Link } from "react-router-dom";

export const LeftBar = ({ isVisible }) => {
  return (
    <>
      {/* <div className={styles.leftBar}> */}
      <div className={isVisible ? `${styles.leftbar_show}` : styles.leftBar}>
        <div className={styles.container}>
          <div className={styles.item}>
            {/* here item means each options (ex: friends, groups ,marketplace etc) */}
            <div className={styles.logo}>
              <PeopleAltIcon />
            </div>
            <div className={styles.header}>
              <h1>Friends</h1>
            </div>
          </div>

          <div className={styles.item2}>
            <div className={styles.logo}>
              <MessageIcon fontSize="small" />
            </div>
            <div className={styles.header}>
              <h1>Messages</h1>
            </div>
          </div>

          <div className={styles.item3}>
            <div className={styles.logo}>
              <TrendingUpIcon fontSize="small" />
            </div>
            <div className={styles.header}>
              <h1>Trending</h1>
            </div>
          </div>
          <div className={styles.item4}>
            <div className={styles.logo}>
              <EventNoteIcon fontSize="small" />
            </div>
            <div className={styles.header}>
              <h1>Events</h1>
            </div>
          </div>
          <Link to="/saved" className={styles.item5}>
            <div className={styles.logo}>
              <BookmarkIcon fontSize="small" />
            </div>
            <div className={styles.header}>
              <h1>Saved</h1>
            </div>
          </Link>

          <div className={styles.item6}>
            <div className={styles.logo}>
              <SettingsIcon fontSize="small" />
            </div>
            <div className={styles.header}>
              <h1>Settings</h1>
            </div>
          </div>

          <div className={styles.item7}>
            <div className={styles.logo}>
              <HelpOutlineIcon fontSize="small" />
            </div>
            <div className={styles.header}>
              <h1>Help</h1>
            </div>
          </div>

          {/* <div className={styles.item7}>
            <div className={styles.logo}>
              
            </div>
            <div className={styles.header}>
              <h1>Trending</h1>
            </div>
          </div>

          <div className={styles.item8}>
            <div className={styles.logo}>
              
            </div>
            <div className={styles.header}>
              <h1>Messages</h1>
            </div>
          </div>
          <div className={styles.item9}>
            <div className = {styles.logo}>
              <OndemandVideoIcon />
            </div>
            <div className={styles.header}>
              <h1>Videos</h1>
            </div>
          </div>
          <hr />
          <div className={styles.item10}>
            <div className ={styles.logo}>
              
            </div>
            <div className={styles.header}>
              <h1>Settings</h1>
            </div>
          </div>

          <div className={styles.item11}>
            <div className = {styles.logo}>
              
            </div>
            <div className={styles.header}>
              <h1>Help</h1>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LeftBar;
