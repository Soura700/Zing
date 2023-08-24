import React from "react";
import "./leftbar2.css";
import image from "../../assets/jd-chow-gutlccGLXKI-unsplash.jpg";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const styles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
};

export const Leftbar2 = () => {
  return (
    <div  style={styles} className="container">
      
      {/* left-options bar */}

      <div className="left-opt-menu">
        <div className="container">
          <div className="items">
            <div className="profile-img">
              <img src={image} alt="" />
            </div>
            <div className="item1">
              <TextsmsIcon fontSize="medium" className="icon1" />
            </div>
            <div className="item2">
              <PeopleRoundedIcon fontSize="medium" className="icon2" />
            </div>
            <div className="item3">
              <CallRoundedIcon fontSize="medium" className="icon3" />
            </div>
            <hr></hr>
            <div className="item4">
              <SettingsRoundedIcon fontSize="medium" className="icon4" />
            </div>
          </div>
        </div>
      </div>

      {/* left - activity bar */}
      <div className="left-menu">
        <div className="top-part">
          <div className="top-part-opt">
            <h1>Messages</h1>
          </div>
          <div className="top-search-bar">
            <input type="text" name="search-bar" placeholder="Search" />
            <div className="search-btn">
              <SearchIcon className="search-icon" />
            </div>
          </div>
          <div className="mid-part">
            <span>Pinned Messages</span>
            <div className="mid-text">
              <div className="left">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">Lorem, ipsum dolor.</p>
                </div>
              </div>
              <div className="right">
                <p>9:26 PM</p>
                {/* <circle></circle> */}
              </div>
            </div>

            <div className="mid-text2">
            <div className="left2">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">typing...</p>
                </div>
              </div>
              <div className="right2">
                <p>9:26 PM</p>
                <circle>5</circle>
              </div>
            </div>

            <div className="mid-text3">
            <div className="left3">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">whats up</p>
                </div>
              </div>
              <div className="right3">
                <p>9:26 PM</p>
                <circle>2</circle>
              </div>
            </div>

            <span>All Conversations</span>

            <div className="mid-text4">
            <div className="left4">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">whats up</p>
                </div>
              </div>
              <div className="right4">
                <p>9:26 PM</p>
                <circle>11</circle>
              </div>
            </div>

            <div className="mid-text5">
            <div className="left5">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">typing...</p>
                </div>
              </div>
              <div className="right5">
                <p>9:26 PM</p>
                <circle>1</circle>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
