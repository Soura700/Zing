import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./resetPasswordForm.css"
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';


const ResetPasswordForm = () => {
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setPasswordsMatch(e.target.value === newPassword);
  };

  const handleUpdateClick = async () => {
    try {
      const response = await axios.post(
        `https://zing-media.onrender.com/api/auth/resetpassword/${id}/${token}`,
        { user_password: confirmNewPassword }
      );

      if (response.status === 200) {
        setPasswordUpdated(true);
      }
    } catch (error) {
    }
  };


  return (
    <div className='rpcontainer'>

      <div className='resetBox'>
        <h2>Reset Password</h2>
        <div className="password-input">
          <input
            type={showPassword1 ? 'text' : 'password'}
            placeholder='Enter your new password'
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          {showPassword1 ? (
            <VisibilityOffRoundedIcon
              className="toggle-password-icon"
              onClick={() => setShowPassword1(!showPassword1)}
            />
          ) : (
            <VisibilityRoundedIcon
              className="toggle-password-icon"
              onClick={() => setShowPassword1(!showPassword1)}
            />
          )}
        </div>
        <div className="password-input">
          <input
            type={showPassword2 ? 'text' : 'password'}
            placeholder='Confirm your new password'
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
          />
          {showPassword2 ? (
            <VisibilityOffRoundedIcon
              className="toggle-password-icon1"
              onClick={() => setShowPassword2(!showPassword2)}
            />
          ) : (
            <VisibilityRoundedIcon
              className="toggle-password-icon1"
              onClick={() => setShowPassword2(!showPassword2)}
            />
          )}
        </div>

        {!passwordsMatch && <p >Passwords do not match!</p>}
        {passwordUpdated ? (
          <p>
            Password updated successfully. You can now log in with your new
            password.
          </p>
        ) : (
          <button
            onClick={handleUpdateClick}>
            Update
          </button>
        )}
      </div>

    </div>
  );
};



export default ResetPasswordForm;