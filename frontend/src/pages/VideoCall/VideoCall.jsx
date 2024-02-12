// import React from "react";
// import "./videocall.css";

// import MicIcon from "@mui/icons-material/Mic";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import CallEndIcon from "@mui/icons-material/CallEnd";
// import VolumeOffIcon from "@mui/icons-material/VolumeOff";
// import MicOffIcon from "@mui/icons-material/MicOff";
// import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import AddIcCallIcon from "@mui/icons-material/AddIcCall";
// import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
// import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import Peer from "simple-peer";
// import { useLocation, useParams } from "react-router-dom";

// const VideoCall = () => {
//   const [showRightPart, setShowRightPart] = useState(true);

//   const [socket, setSocket] = useState(/* Your socket instance */);
//   const [peer, setPeer] = useState(null);
//   const [callerSignal, setCallerSignal] = useState();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [mediaStream, setMediaStream] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(false);
//   const [callerStream, setCallerStream] = useState(null);
//   const userVideo = useRef();
//   const partnerVideo = useRef();
//   const [isSoundMuted, setIsSoundMuted] = useState(false);
//   const [isVideo, setIsVideo] = useState(false);

//   const location = useLocation();
//   var { userId, userName, clicked } = location.state || {};

//   useEffect(() => {
//     const newSocket = io("http://localhost:5500");
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Connected to the server");
//     });

//     return () => {
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (socket) {
//       // Listen for incoming calls
//       socket.on("incomingCall", (data) => {
//         setIncomingCall(true);
//         setCallerSignal(data.signal);
//       });
//     }
//   }, [socket]);

//   const callUser = (id) => {
//     const newPeer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: mediaStream,
//     });

//     newPeer.on("signal", (data) => {
//       // Send call signal to the other user
//       socket.emit("callUser", {
//         userToCall: id,
//         signalData: data,
//         from: userId,
//       });
//     });

//     newPeer.on("stream", (stream) => {
//       // Display caller's video
//       partnerVideo.current.srcObject = stream;
//       setCallerStream(stream);
//     });

//     socket.on("callAccepted", (data) => {
//       // Set the signal from the callee
//       setCallAccepted(true);
//       newPeer.signal(data.signal);
//     });

//     setPeer(newPeer);
//   };

//   const answerCall = () => {
//     const newPeer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: mediaStream,
//     });

//     newPeer.on("signal", (data) => {
//       // Send answer signal to the caller
//       console.log("Data");
//       console.log(data);
//       socket.emit("answerCall", { signal: data, to: userId });
//     });

//     // Ensure that partnerVideo.current is defined before setting srcObject
//     if (partnerVideo.current) {
//       newPeer.on("stream", (stream) => {
//         // Display receiver's's video
//         partnerVideo.current.srcObject = stream;
//       });
//     } else {
//       console.error("partnerVideo.current is undefined or null");
//     }

//     if (userVideo.current) {
//       userVideo.current.srcObject = callerStream;
//     } 
//     else {
//       console.error("userVideo.current is undefined or null");
//     }

//     newPeer.signal(callerSignal);

//     setPeer(newPeer);
//   };

//   console.log(partnerVideo);

//   const handleCallButtonClick = () => {
//     // Call logic here
//     const friendId = userId;
//     if (!peer) {
//       callUser(friendId);
//     }
//   };

//   const handleAcceptButtonClick = () => {
//     // Answer the incoming call
//     answerCall(callerStream);
//     setIncomingCall(false);
//   };

//   useEffect(() => {
//     // Fetch and set media stream here
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setMediaStream(stream);
//         userVideo.current.srcObject = stream;
//       })
//       .catch((error) => console.error("Error accessing media devices:", error));

//     return () => {
//       if (peer) {
//         peer.destroy();
//         setPeer(null);
//       }
//     };
//   }, [peer]);

//   useEffect(() => {
//     // Listen for video toggle message from server
//     socket.on("videoToggled", ({ isVideoEnabled }) => {
//       // Update video stream based on received message
//       if (isVideoEnabled) {
//         // Enable video stream
//         if (mediaStream) {
//           mediaStream.getVideoTracks().forEach((track) => {
//             track.enabled = true;
//           });
//         }
//       } else {
//         // Disable video stream
//         if (mediaStream) {
//           mediaStream.getVideoTracks().forEach((track) => {
//             track.enabled = false;
//           });
//         }
//       }
//     });

//     // Clean up the event listener when component unmounts
//     return () => {
//       socket.off("videoToggled");
//     };
//   }, [socket, mediaStream]);

//   const toggleRightPart = () => {
//     setShowRightPart(!showRightPart);
//   };

//   const [soundIcon, setSoundIcon] = useState(false);

//   const toggleSoundIcon = async () => {
//     setSoundIcon(!soundIcon);
//   };
//   const [videoIcon, setVideoIcon] = useState(false);

//   const toggleVideoIcon = async () => {
//     setVideoIcon(!videoIcon);
//   };
//   const [endCallIcon, setEndCallIcon] = useState(false);

//   const toggleEndCallIcon = async () => {
//     setEndCallIcon(!endCallIcon);
//   };

//   const toggleSoundMute = () => {
//     setIsSoundMuted((prevState) => !prevState);
//     if (mediaStream) {
//       mediaStream.getAudioTracks().forEach((track) => {
//         track.enabled = !isSoundMuted;
//       });
//     }
//   };

//   // const toggleVideo = () => {
//   //   setIsVideo(prevState => !prevState);
//   //   if (mediaStream) {
//   //     mediaStream.getVideoTracks().forEach(track => {
//   //       track.enabled = !isVideo;
//   //     });
//   //   }
//   // };
//   const handleVideoToggle = () => {
//     alert("Called");
//     // Toggle video state locally
//     const newVideoState = !isVideo;
//     setIsVideo(newVideoState);
//     // Emit a message to the server indicating video toggle
//     socket.emit("toggleVideo", newVideoState);
//   };

//   return (
//     <div className="outer-rect videocall">
//       <div className="left-inner-rect"></div>
//       <div className="right-inner-rect">
//         <div className="right-inner-bottom">
//           <div className="left-video-part">
//             <div className="camera-video">
//               <div className="cam">
//                 <div className="cam1">
//                   {/* <img className="image1" src={img1} alt="" /> */}
//                   <div className="name-overlay">
//                     <video ref={userVideo} autoPlay className="callerVid" />
//                     {/* caller's video screen */}
//                   </div>
//                   <div className="name-overlay1">
//                     {" "}
//                     {/* <VolumeOffIcon /> */}
//                   </div>
//                 </div>
//                 <div className="rec-cam1">
//                   {/* <img className="image1" src={img1} alt="" /> */}
//                   <div className="rec-name-overlay2 ">
//                     <video
//                       ref={partnerVideo}
//                       autoPlay
//                       className="receiverVid2"
//                     />
//                   </div>
//                   <div className="rec-name-overlay1">
//                     {" "}
//                     {/* <VolumeOffIcon /> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="cam">
//                 <div className="rec-cam1">
//                   {/* <img className="image1" src={img1} alt="" /> */}
//                   <div className="rec-name-overlay">
//                     {" "}
//                     {callAccepted && (
//                       <video
//                         ref={partnerVideo}
//                         autoPlay
//                         className="receiverVid"
//                       />
//                     )}
//                     {/* receiver's video screen */}
//                   </div>
//                   <div className="rec-name-overlay1">
//                     {" "}
//                     {/* <VolumeOffIcon /> */}
//                   </div>
//                 </div>
//                 {/* <div className="cam1">
//                   <img className="image1" src={img1} alt="" />
//                   <div className="name-overlay">Camera 4</div>
//                   <div className="name-overlay1">
//                     {" "}
//                     <VolumeOffIcon />
//                   </div>
//                 </div> */}
//               </div>
//             </div>
//             <div className="video-control">
//               <div className="icons">
//                 <div className="mic">
//                   {soundIcon ? (
//                     <MicIcon
//                       className="videocontrolicons "
//                       onClick={() => {
//                         toggleSoundIcon();
//                         toggleSoundMute();
//                       }}
//                     />
//                   ) : (
//                     <MicOffIcon
//                       className="videocontrolicons active"
//                       onClick={() => {
//                         toggleSoundIcon();
//                         toggleSoundMute();
//                       }}
//                     />
//                   )}
//                 </div>
//                 <div className="mic">
//                   {videoIcon ? (
//                     <VideocamIcon
//                       className="videocontrolicons "
//                       onClick={() => {
//                         toggleVideoIcon();
//                         handleVideoToggle();
//                       }}
//                     />
//                   ) : (
//                     <VideocamOffIcon
//                       className="videocontrolicons active"
//                       onClick={() => {
//                         toggleVideoIcon();
//                         handleVideoToggle();
//                       }}
//                     />
//                   )}
//                 </div>
//                 <div className="end-call">
//                   {endCallIcon ? (
//                     <CallEndIcon
//                       className="callEndIcon active"
//                       onClick={toggleEndCallIcon}
//                     />
//                   ) : (
//                     <CallEndIcon
//                       className="callEndIcon"
//                       onClick={toggleEndCallIcon}
//                     />
//                   )}
//                   <button
//                     onClick={handleCallButtonClick}
//                     className="startCallBtn"
//                   >
//                     Start <AddIcCallIcon />
//                   </button>
//                 </div>
//                 {incomingCall && (
//                   <button
//                     onClick={handleAcceptButtonClick}
//                     className="acceptCallBtn"
//                   >
//                     Accept <PhoneForwardedIcon />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;










import React from 'react';
import './videocall.css';

import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useLocation, useParams } from 'react-router-dom';

const VideoCall = () => {
  const [showRightPart, setShowRightPart] = useState(true);

  const [socket, setSocket] = useState(/* Your socket instance */);
  const [peer, setPeer] = useState(null);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerStream, setCallerStream] = useState(null);
  // const [cameraStatus, setCameraStatus] = useState(true);
  // const [micStatus, setMicStatus] = useState(true);
  const [soundIcon, setSoundIcon] = useState(true);
  const [videoIcon, setVideoIcon] = useState(true);
  const [endCallIcon, setEndCallIcon] = useState(false);
  const userVideo = useRef();
  const partnerVideo = useRef();

  const location = useLocation();
  var { userId, userName, clicked } = location.state || {};

  useEffect(() => {
    const newSocket = io('http://localhost:5500');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server');
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming calls
      socket.on('incomingCall', (data) => {
        setIncomingCall(true);
        setCallerSignal(data.signal);
      });
    }
  }, [socket]);

  // useEffect(() => {
  //   socket.on('cameraToggle', (status) => {
  //     setVideoIcon(status);
  //   });

  //   socket.on('micToggle', (status) => {
  //     setSoundIcon(status);
  //   });
  // }, [socket]);
  
  useEffect(() => {
    if (socket) {
      // Listen for audio status change events
      socket.on('audioStatusChanged', (status) => {
        setSoundIcon(status);
      });

      // Listen for video status change events
      socket.on('videoStatusChanged', (status) => {
        setVideoIcon(status);
      });
    }
  }, [socket]);

  const callUser = (id) => {
    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream: mediaStream,
    });

    newPeer.on('signal', (data) => {
      // Send call signal to the other user
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: userId,
      });
    });

    newPeer.on('stream', (stream) => {
      // Display caller's video
      partnerVideo.current.srcObject = stream;
      setCallerStream(stream);
    });

    socket.on('callAccepted', (data) => {
      // Set the signal from the callee
      setCallAccepted(true);
      newPeer.signal(data.signal);
    });

    setPeer(newPeer);
  };

  const answerCall = () => {
    const newPeer = new Peer({
      initiator: false,
      trickle: false,
      stream: mediaStream,
    });

    newPeer.on('signal', (data) => {
      // Send answer signal to the caller
      console.log('Data');
      console.log(data);
      socket.emit('answerCall', { signal: data, to: userId });
    });

    // Ensure that partnerVideo.current is defined before setting srcObject
    if (partnerVideo.current) {
      newPeer.on('stream', (stream) => {
        // Display receiver's's video
        partnerVideo.current.srcObject = stream;
      });
    } else {
      console.error('partnerVideo.current is undefined or null');
    }

    if (userVideo.current) {
      userVideo.current.srcObject = callerStream;
    } else {
      console.error('userVideo.current is undefined or null');
    }

    newPeer.signal(callerSignal);

    setPeer(newPeer);
  };

  console.log(partnerVideo);

  const handleCallButtonClick = () => {
    // Call logic here
    const friendId = userId;
    if (!peer) {
      callUser(friendId);
    }
  };

  const handleAcceptButtonClick = () => {
    // Answer the incoming call
    answerCall(callerStream);
    setIncomingCall(false);
  };

  useEffect(() => {
    // Fetch and set media stream here
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMediaStream(stream);
        userVideo.current.srcObject = stream;
      })
      .catch((error) => console.error('Error accessing media devices:', error));

    return () => {
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
    };
  }, [peer]);

  const toggleRightPart = () => {
    setShowRightPart(!showRightPart);
  };

  const toggleSoundIcon = () => {
    // Toggle sound icon and mute/unmute audio
    setSoundIcon((prevState) => !prevState);
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      // Emit event to inform other users about the audio status change
      socket.emit('audioStatusChanged', !soundIcon);
    }
  };

  const toggleVideoIcon = () => {
    // Toggle video icon and hide/show video
    setVideoIcon((prevState) => !prevState);
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      // Emit event to inform other users about the video status change
      socket.emit('videoStatusChanged', !videoIcon);
    }
  };

  const toggleEndCallIcon = async () => {
    setEndCallIcon(!endCallIcon);
  };
  return (
    <div className='outer-rect videocall'>
      <div className='left-inner-rect'></div>
      <div className='right-inner-rect'>
        <div className='right-inner-bottom'>
          <div className='left-video-part'>
            <div className='camera-video'>
              <div className='cam'>
                <div className='cam1'>
                  {/* <img className="image1" src={img1} alt="" /> */}
                  <div className='name-overlay'>
                    <video
                      ref={userVideo}
                      autoPlay
                      className='callerVid'
                    />
                    {/* caller's video screen */}
                  </div>
                  <div className='name-overlay1'>
                    {' '}
                    {/* <VolumeOffIcon /> */}
                  </div>
                </div>
                <div className='rec-cam1'>
                  {/* <img className="image1" src={img1} alt="" /> */}
                  <div className='rec-name-overlay2 '>
                    <video
                      ref={partnerVideo}
                      autoPlay
                      className='receiverVid2'
                    />
                  </div>
                  <div className='rec-name-overlay1'>
                    {' '}
                    {/* <VolumeOffIcon /> */}
                  </div>
                </div>
              </div>
              <div className='cam'>
                <div className='rec-cam1'>
                  {/* <img className="image1" src={img1} alt="" /> */}
                  <div className='rec-name-overlay'>
                    {' '}
                    {callAccepted && (
                      <video
                        ref={partnerVideo}
                        autoPlay
                        className='receiverVid'
                      />
                    )}
                    {/* receiver's video screen */}
                  </div>
                  <div className='rec-name-overlay1'>
                    {' '}
                    {/* <VolumeOffIcon /> */}
                  </div>
                </div>
                {/* <div className="cam1">
                  <img className="image1" src={img1} alt="" />
                  <div className="name-overlay">Camera 4</div>
                  <div className="name-overlay1">
                    {" "}
                    <VolumeOffIcon />
                  </div>
                </div> */}
              </div>
            </div>
            <div className='video-control'>
              <div className='icons'>
                <div className='mic'>
                  {soundIcon ? (
                    <MicOffIcon
                      className='videocontrolicons active'
                      onClick={toggleSoundIcon}
                    />
                  ) : (
                    <MicIcon
                      className='videocontrolicons'
                      onClick={toggleSoundIcon}
                    />
                  )}
                </div>
                <div className='mic'>
                  {videoIcon ? (
                    <VideocamOffIcon
                      className='videocontrolicons active'
                      onClick={toggleVideoIcon}
                    />
                  ) : (
                    <VideocamIcon
                      className='videocontrolicons'
                      onClick={toggleVideoIcon}
                    />
                  )}
                </div>
                <div className='end-call'>
                  {endCallIcon ? (
                    <CallEndIcon
                      className='callEndIcon active'
                      onClick={toggleEndCallIcon}
                    />
                  ) : (
                    <CallEndIcon
                      className='callEndIcon'
                      onClick={toggleEndCallIcon}
                    />
                  )}
                  <button
                    onClick={handleCallButtonClick}
                    className='startCallBtn'>
                    Start <AddIcCallIcon />
                  </button>
                </div>
                {incomingCall && (
                  <button
                    onClick={handleAcceptButtonClick}
                    className='acceptCallBtn'>
                    Accept <PhoneForwardedIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;