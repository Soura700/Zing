import React, { useState } from 'react';
import axios from 'axios';
import "./forgotPasswordForm.css";
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setInvalidEmail(false);
  };

  const handleSendClick = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/password/forgotpassword',
        { email }
      );

      if (response.status === 200) {
        setEmailSent(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setInvalidEmail(true);
      }
    }
  };

  // Use these styles in the component:

  // const styles = {
  //   container: {
  //     maxWidth: '400px',
  //     margin: 'auto',
  //     padding: '20px',
  //     border: '1px solid #ccc',
  //     borderRadius: '5px',
  //   },
  //   input: {
  //     width: '100%',
  //     padding: '10px',
  //     marginBottom: '10px',
  //     boxSizing: 'border-box',
  //   },
  //   button: {
  //     width: '100%',
  //     padding: '10px',
  //     backgroundColor: '#4CAF50',
  //     color: 'white',
  //     border: 'none',
  //     borderRadius: '5px',
  //     cursor: 'pointer',
  //   },
  //   error: {
  //     color: 'red',
  //     marginBottom: '10px',
  //   },
  // };

  return (
    <div className='pwcontainer'>

      <div className='side'>

      </div>
      <div className='forgotpwDiv'>
        <h2>Forgot Password?</h2>
        <p>Enter your registered Email address to get the new password delivered</p>
        <input
          type='email'
          placeholder='Enter your registered email'
          value={email}
          onChange={handleEmailChange}
        />
        {invalidEmail && <p>Invalid email</p>}
        {emailSent ? (
          <p>Email sent. Please check your inbox for the reset link.</p>
        ) : (
          <button
            onClick={handleSendClick}>
            Send
          </button>
        )}
      </div>

    </div>
  );
};

export default ForgotPasswordForm;
