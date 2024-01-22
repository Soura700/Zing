import React from "react";
import "./videocall.css";

import mic from "../../videoAssets/mic.svg";
import volume from "../../videoAssets/volume-2.svg";
import video from "../../videoAssets/video.svg";
import endcall from "../../videoAssets/phone-call.svg";
import home from "../../videoAssets/home.svg";
import settings from "../../videoAssets/settings.svg";
import more from "../../videoAssets/more-horizontal.svg";
import fullscreen from "../../videoAssets/maximize.svg";

import edit from "../../videoAssets/edit.svg";
import Notification from "../../videoAssets/bell.svg";
import calendar from "../../videoAssets/calendar.svg";
import logout from "../../videoAssets/log-out.svg";
import arrowleft from "../../videoAssets/arrow-left.svg";
import img1 from "../../videoAssets/mask-group@2x.png";
import img2 from "../../videoAssets/group-26@2x.png";
import profile from "../../videoAssets/iconprofile@2x.png";
import adduser from "../../videoAssets/user-plus.svg";
import img3 from "../../videoAssets/group-23@2x.png";
import img4 from "../../videoAssets/group-34@2x.png";
import img5 from "../../videoAssets/group-29@2x.png";
import img6 from "../../videoAssets/group-27@2x.png";
import paper from "../../videoAssets/file-minus.svg";
import camera from "../../videoAssets/camera.svg";
import lines from "../../videoAssets/bar-chart-2.svg";
import emoji from "../../videoAssets/smile.svg";
import send from "../../videoAssets/send.svg";
import logo from "../../videoAssets/aperture.svg";
import darklight from "../../videoAssets/moon.svg";
import { useState } from "react";
const VideoCall = () => {
  const [showRightPart, setShowRightPart] = useState(true);
  const toggleRightPart = () => {
    setShowRightPart(!showRightPart);
  };
  return (
    <div className="outer-rect">
      <div className="left-inner-rect">
        <div className="left-button">
          <img className="iconlogo" src={logo} alt="" />
          <img className="leftbuttonicon" alt="" src={home} />
          <img className="leftbuttonicon" alt="" src={video} />
          <img className="leftbuttonicon" alt="" src={Notification} />
          <img className="leftbuttonicon" alt="" src={calendar} />
          <img className="leftbuttonicon" alt="" src={settings} />
          <img
            className="leftbuttonicon"
            alt=""
            src={arrowleft}
            onClick={toggleRightPart}
          />
          <img className="iconlyboldlogout" alt="" src={logout} />
          <img className="dark-light-icon" alt="" src={darklight} />
        </div>
      </div>
      <div className="right-inner-rect">
        <div className="header">
          <div className="header-left">
            <div className="preparing">Preparing for the holiday</div>
            <div className="time">02:22:09</div>
            <div className="leave">Leave</div>
          </div>
          <div className="header-middle">
            <img className="fullscreen" src={fullscreen} alt="" />
          </div>
          <div className="header-right">
            <div className="number">23</div>
            <img src={adduser} alt="" />
          </div>
        </div>
        <div className="right-inner-bottom">
          <div className="left-part">
            <div className="camera-video">
              <div className="cam">
                <div className="cam1">
                  <img className="image1" src={img1} alt="" />
                  <div className="name-overlay">Camera 1</div>
                </div>
                <div className="cam1">
                  <img className="image1" src={img1} alt="" />
                  <div className="name-overlay">Camera 2</div>
                </div>
              </div>
              <div className="cam">
                <div className="cam1">
                  <img className="image1" src={img1} alt="" />
                  <div className="name-overlay">Camera 3</div>
                </div>
                <div className="cam1">
                  <img className="image1" src={img1} alt="" />
                  <div className="name-overlay">Camera 4</div>
                </div>
              </div>
            </div>
            <div className="video-control">
              <div className="icons">
                <div className="mic">
                  <img className="videocontrolicons" alt="" src={mic} />
                </div>
                <div className="mic">
                  <img className="videocontrolicons" alt="" src={volume} />
                </div>
                <div className="mic">
                  <img className="videocontrolicons" alt="" src={video} />
                </div>
                <div className="end-call">
                  <img className="videocontrolicons" alt="" src={endcall} />
                </div>
                <div className="mic">
                  <img className="videocontrolicons" alt="" src={edit} />
                </div>
                <div className="mic">
                  <img className="videocontrolicons" alt="" src={fullscreen} />
                </div>
                <div className="mic">
                  <img className="videocontrolicons" alt="" src={more} />
                </div>
              </div>
            </div>
          </div>
          <div className="right-part">
            <div className="switch">
              <div className="messages">Messages</div>
              <div className="participants">Participants</div>
            </div>
            <div className="person1-chat">
              <img className="person1-img" alt="" src={img3} />
              <div className="person1-text">
                <p className="text">
                  Hello friend I apologize for the delay in replying I have
                  problem with microphone.
                </p>
              </div>
            </div>
            <div className="person2-chat">
              <div className="person1-text">
                <p className="text">
                  Hello friend I apologize for the delay in replying I have
                  problem with microphone.
                </p>
              </div>
              <img className="person2-img" alt="" src={img5} />
            </div>
            <div className="person1-chat">
              <img className="person1-img" alt="" src={img3} />
              <div className="person1-text">
                <p className="text">
                  Hello friend I apologize for the delay in replying I have
                  problem with microphone.
                </p>
              </div>
            </div>
            <div className="person2-chat">
              <div className="person1-text">
                <p className="text">
                  Hello friend I apologize for the delay in replying I have
                  problem with microphone.
                </p>
              </div>
              <img className="person2-img" alt="" src={img5} />
            </div>
            <div className="chattop">
              <div className="upload">
                <img className="iconlyboldpaper" alt="" src={paper} />
                <img className="iconlyboldpaper" alt="" src={camera} />
              </div>
              <div className="upload">
                <div className="you">Irezak</div>
                <img className="frame-item" alt="" src={lines} />
              </div>
              <img className="emoji-icon" alt="" src={emoji} />
            </div>
            <div className="chatbox1">
              <div className="you">Type a message ...</div>
              <div className="sendicon">
                <img className="iconlyboldsend" alt="" src={send} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
