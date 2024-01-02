import React, { useState , useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import MicNoneIcon from "@mui/icons-material/MicNone";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Avatar from "@mui/material/Avatar";
import Peer from "simple-peer";

// import "./CallUI.css"; // You can create a CSS file for styling

const CallUI = ({ caller, onAccept, onReject, onEndCall, isCalling }) => {
  console.log(isCalling);
  const [open, setOpen] = useState(true);
  const [peer , setPeer]  = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [audioElement, setAudioElement] = useState(null); // Store the audio element reference
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); 



  const handleClose = () => {
    setOpen(false);
    onReject(); // Reject the call when the dialog is closed
  };

    // Function to start the audio call
    // const startAudioCall = async () => {
    //   try {
    //     // Get user's audio stream
    //     const userMedia = await navigator.mediaDevices.getUserMedia({
    //       audio: true,
    //     });
    //     setAudioStream(userMedia);
  
    //     // Create a new Peer instance
    //     const newPeer = new Peer({
    //       initiator: true,
    //       stream: userMedia,
    //       trickle: false,
    //     });
  
    //     // Set up event handlers for the Peer instance
    //     newPeer.on("signal", (data) => {
    //       // Send the offer signal to the other user
    //       // You need to implement this logic to send the signal to the caller
    //       // Typically, you would send the `data` to the caller using your socket connection
    //     });
  
    //     newPeer.on("stream", (remoteStream) => {
    //       // Handle the remote user's audio stream
    //       // Play the audio in your UI
    //     });
  
    //     setPeer(newPeer);
    //   } catch (error) {
    //     console.error("Error starting audio call:", error);
    //   }
    // };

    
  useEffect(() => {
    if (isCalling) {

      alert("True CallUi");
      // Initialize the Peer connection and set up the audio stream when the call is accepted
      const initializePeer = async () => {
        try {
          // Get user's audio stream
          const userMedia = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          setAudioStream(userMedia);

          // Create a new Peer instance
          const newPeer = new Peer({
            initiator: true,
            stream: userMedia,
            trickle: false,
          });

          // Set up event handlers for the Peer instance
          newPeer.on("signal", (data) => {
            
            // Send the offer signal to the other user
            // You need to implement this logic to send the signal to the caller
            // Typically, you would send the `data` to the caller using your socket connection

          });

          // newPeer.on("stream", (remoteStream) => {
          //   // Handle the remote user's audio stream
          //   // Play the audio in your UI
          //   // Create an <audio> element and set its source to the remote stream
          //   const audioElement = document.createElement("audio");
          //   audioElement.srcObject = remoteStream;
          //   audioElement.autoplay = true; // Start playing the audio automatically
          //   document.body.appendChild(audioElement); // Append the element to the DOM
          // });


          newPeer.on("stream", (remoteStream) => {
            // Create an <audio> element and set its source to the remote stream
            const audioElement = document.createElement("audio");
            audioElement.srcObject = remoteStream;
            audioElement.autoplay = true; // Start playing the audio automatically
            // Append the audio element to the DOM
            document.body.appendChild(audioElement);

            console.log("Audio Element: ");

            console.log(audioElement);

            alert(audioElement);

          });
          

          setPeer(newPeer);

          navigator.mediaDevices.enumerateDevices().then((devices)=>{
            devices.forEach(device => {
              console.log(device);
            });
          })
        } catch (error) {
          console.error("Error starting audio call:", error);
        }
      };

      initializePeer();
    }
  }, [isCalling]);


    // const endAudioCall = () => {
    //   // Stop the audio stream
    //   if (audioStream) {
    //     audioStream.getTracks().forEach((track) => {
    //       track.stop();
    //     });
    //   }
  
    //   // Destroy the Peer instance
    //   if (peer) {
    //     peer.destroy();
    //   }
  
    //   // Call the `onEndCall` callback to inform the parent component
    //   onEndCall();
    // };

    // useEffect(() => {
    //   // Create an <audio> element when the component mounts
    //   const audio = document.createElement("audio");
    //   setAudioElement(audio);
  
    //   // Clean up when the component unmounts
    //   return () => {
    //     // Remove the audio element from the DOM
    //     if (audioElement) {
    //       audioElement.remove();
    //     }
    //   };
    // }, []);
  
    // useEffect(() => {
    //   // When `isAudioPlaying` changes, play or stop the audio
    //   if (isAudioPlaying) {
    //     audioElement.autoplay = true; // Start playing the audio
    //   } else {
    //     audioElement.pause(); // Pause the audio
    //     audioElement.currentTime = 0; // Reset audio to the beginning
    //   }
    // }, [isAudioPlaying, audioElement]);

    
  const handleAccept = () => {
    alert("Called");
    setIsAudioPlaying(true); // Start playing the audio when "Accept" is clicked
    onAccept(); // Trigger the onAccept callback
  };


    const endAudioCall = () => {
      // Stop the audio stream
      if (audioStream) {
        audioStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
  
      // Destroy the Peer instance
      if (peer) {
        peer.destroy();
      }
  
      // Call the `onEndCall` callback to inform the parent component
      onEndCall();
    };
  

  return (
    <div className="call-ui">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <div className="caller-info">
            <Avatar alt={caller.name} src={caller.avatar} />
            <span>{caller.name}</span>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isCalling ? "Call in progress..." : "Incoming call..."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isCalling ? (
            <>
              <Button
                onClick={onEndCall}
                startIcon={<PhoneDisabledIcon />}
                color="primary"
                variant="outlined"
              >
                End Call
              </Button>
              <Button
                startIcon={<MicNoneIcon />}
                color="primary"
                variant="outlined"
              >
                Mute
              </Button>
              <Button
                startIcon={<VolumeOffIcon />}
                color="primary"
                variant="outlined"
              >
                Speaker
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  // onAccept();
                  handleAccept();
                  setOpen(false);
                  // startAudioCall();//Start the audio call
                }}
                startIcon={<CallRoundedIcon />}
                color="primary"
                variant="outlined"
              >
                Accept
              </Button>
              <Button
                onClick={handleClose}
                startIcon={<PhoneDisabledIcon />}
                color="primary"
                variant="outlined"
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CallUI;
