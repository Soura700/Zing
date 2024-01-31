import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPasswordForm = () => {
  const {id,token} = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

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
        `http://localhost:5000/api/auth/resetpassword/${id}/${token}`,
        { user_password: confirmNewPassword }
      );

      if (response.status === 200) {
        setPasswordUpdated(true);
      }
    } catch (error) {
      // Handle error
    }
  };

  // Use these styles in the component:

  const styles = {
    container: {
      maxWidth: '400px',
      margin: 'auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Reset Password</h2>
      <input
        type='password'
        placeholder='Enter your new password'
        value={newPassword}
        onChange={handleNewPasswordChange}
        style={styles.input}
      />
      <input
        type='password'
        placeholder='Confirm your new password'
        value={confirmNewPassword}
        onChange={handleConfirmNewPasswordChange}
        style={styles.input}
      />
      {!passwordsMatch && <p style={styles.error}>Passwords do not match</p>}
      {passwordUpdated ? (
        <p>
          Password updated successfully. You can now log in with your new
          password.
        </p>
      ) : (
        <button
          onClick={handleUpdateClick}
          style={styles.button}>
          Update
        </button>
      )}
    </div>
  );
};

export default ResetPasswordForm;