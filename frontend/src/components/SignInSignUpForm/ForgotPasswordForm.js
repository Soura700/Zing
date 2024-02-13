import React, { useState } from "react";
import axios from "axios";
import "./forgotPasswordForm.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setInvalidEmail(false);
  };

  const handleSendClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/password/forgotpassword",
        { email }
      );

      alert(response.status);

      if (response.status === 200) {
        toast.success("Email has been sent successfully");
        setEmailSent(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Wrong Credentials");
        setInvalidEmail(true);
      }
    }
  };


  return (
    <div className="pwcontainer">
      <div className="side"></div>
      <div className="forgotpwDiv">
        <h2>Forgot Password?</h2>
        <p>
          Enter your registered Email address to get the new password delivered
        </p>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={handleEmailChange}
        />
        {invalidEmail && <p>Invalid email</p>}
        {emailSent ? (
          <p>Email sent. Please check your inbox for the reset link.</p>
        ) : (
          <button onClick={handleSendClick}>Send</button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordForm;
