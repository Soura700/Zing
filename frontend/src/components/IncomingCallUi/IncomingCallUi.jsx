import React, { useState } from "react";
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
// import "./CallUI.css"; // You can create a CSS file for styling

const CallUI = ({ caller, onAccept, onReject, onEndCall, isCalling }) => {
  const [open, setOpen] = useState(true);
  console.log(caller);

  const handleClose = () => {
    setOpen(false);
    onReject(); // Reject the call when the dialog is closed
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
                  onAccept();
                  setOpen(false);
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
