import "./rightBar2.css";
import React from 'react'
import CallIcon from '@mui/icons-material/Call';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CollectionsIcon from '@mui/icons-material/Collections';
import LockIcon from '@mui/icons-material/Lock';
import SpeedIcon from '@mui/icons-material/Speed';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';




export const RightBar2 = () => {
  return (
    <div className="container">
      <div className="image">
        <img className="img" src="https://plus.unsplash.com/premium_photo-1661281350976-59b9514e5364?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG9mZmljZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="" />
      </div>
      <div className="accountname">
        John Doe
      </div>
      <div className="contacticons">
        <button className="call">
          <CallIcon/>
        </button>
        <button className="message">
          <ChatBubbleIcon/>
        </button>
        <button className="videocall">
          <VideoCallIcon/>
        </button>
      </div>
      <div className="Last">
        10 hours ago
      </div>
      <div className="notifications">
        <button className="custom">
        <NotificationsIcon/>
        &nbsp;
        Custom Notification
        </button>
        <button className="media_visibility">
          <CollectionsIcon/>
          &nbsp;
          Media Visibility
        </button>
      </div>
      <div className="chat_settings">
        <button className="encryption">
          <LockIcon/>
          &nbsp;
          Encryption
        </button>
        <button className="disappear">
          <SpeedIcon/>
          &nbsp;
          Disappearing Messages
        </button>
        <button className="chat_lock">
          <RateReviewIcon/>
          &nbsp;
          Chat Lock
        </button>
      </div>
      <div className="modify_chat">
        <button className="block">
          <BlockIcon/>
          &nbsp;
          Block John Doe
        </button>
        <button className="report">
          <ReportIcon/>
          &nbsp;
          Report John Doe
        </button>
      </div>
    </div>
  )
}
