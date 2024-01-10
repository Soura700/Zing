import axios from "axios";
import img from "../../assets/img.svg";
import img2 from "../../assets/img1svg.svg";
import "./sign.css";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import YourComponent from "../../pages/Personalization/YourComponent";

const SignInSignUpForm = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  const [errorMessages, setErrorMessages] = useState([]);

  const [SignInerrorMessages, setSignInErrorMessages] = useState([]);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);


  const [signInemailError, setSignInEmailError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState([]);

  
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };



  // Handle sign in
  const handleSubmitSignIn = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        {
          withCredentials: true,
        }
      );
      console.log("Login response:", response.data);
      // Handle success or redirect the user
    } catch (error) {
      console.error("Login error:", error);

      // if (error.response.status === 401) {
      //   // Show a popup or alert indicating that the user already exists
      //   setSignInErrorMessages("Wrong Credentials!!!");
      //   openModal();
      // }
      // else if(error.response.status === 400){
      //   setSignInErrorMessages("User Not Found");
      // }

      // else{
        if (error.response.status === 401) {

          alert("sdkc sdkc ksdjc kjds c")
          // Show a popup or alert indicating that the user already exists
          setSignInErrorMessages("Wrong Credentials");
          // alert("User already exists!");
          // openModal();

        }

        else{
              
        if (error.response && error.response.data) {

          const messagesArray = error.response.data.split("@");
          console.log(messagesArray);
          alert(messagesArray);
          // Find the specific error messages for email and password
          const emailError = messagesArray.find((message) =>
            message.includes("Email")
          );
          const passwordError = messagesArray.filter((message) =>
            message.includes("Password")
          );
          setSignInEmailError(emailError || "");
          setSignInPasswordError(passwordError || "");
      }
        }
    }
  };

















  const handleSubmitSignUp = async (event) => {
    // const navigate = useNavigate();

    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        {
          withCredentials: true,
        }
      );

      console.log(response);

      console.log("Register response:", response.data);

      console.log(response.status);

      if (response.status === 200) {
        navigate("/profile_setting/1");
      
      }

      // Handle success or redirect the user
    } catch (error) {


      console.error("Register error:", error);

      if (error.response.status === 401) {
        // Show a popup or alert indicating that the user already exists
        setErrorMessages("User Already Registered ... Try differenet mail or username");
        alert("User already exists!");
        openModal();
      }

      else{


        if (error.response && error.response.data) {
          const messagesArray = error.response.data.split("@");
          console.log(messagesArray);
          // Find the specific error messages for email and password
          const emailError = messagesArray.find((message) =>
            message.includes("Email")
          );
          const passwordError = messagesArray.filter((message) =>
            message.includes("Password")
          );
          // const formattedPasswordErrors = passwordError.map(error => error.split(/(?<=P)/).map((part, index) => index === 0 ? part.slice(1) : part));
          // console.log(formattedPasswordErrors);
          setErrorMessages(messagesArray);
          setEmailError(emailError || "");
          setPasswordError(passwordError || "");
  
          // setErrorMessages([error.response.data]);
          setErrorMessages(
            messagesArray.filter(
              (message) =>
                !message.includes("Email") && !message.includes("Password")
            )
          );
        }
      } 
      // Handle error
    }
  };


  return (
    <div className={`sign_container ${isSignUp ? "sign-up-mode" : ""}`}>


      <div className="forms-container">
        <div className="signin-signup">
          <form
            action="#"
            onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn}
            method="post"
            className="sign-in-form"
          >
            <h2 class="title">Sign in</h2>

            {SignInerrorMessages.length > 0 && (
              <div className="error-messages alert alert-danger" role="alert">
              <ul>
                {SignInerrorMessages}
              </ul>
              </div>
            )}

            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="email" name="email" placeholder="Email" />
            </div>

            {signInemailError && (
              <div className="error-message" style={{ color: "red" }}>
                {signInemailError}
              </div>
            )}


            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                name="user_password"
                placeholder="Password"
              />
            </div>

            {signInPasswordError && (
              <div className="error-message" style={{ color: "red" }}>
                <ul>
                  {signInPasswordError.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}


            <input type="submit" value="Login" class="btn solid" />
            <p class="social-text">Or Sign in with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
          <form
            action="#"
            onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn}
            method="post"
            className="sign-up-form"
          >
            <h2 class="title">Sign up</h2>
            {errorMessages.length > 0 && (
              <div className="error-messages alert alert-danger" role="alert">
              <ul>
                {errorMessages}
              </ul>
              </div>
            )}
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" name="username" placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input type="email" name="email" placeholder="Email" />
            </div>

            {emailError && (
              <div className="error-message" style={{ color: "red" }}>
                {emailError}
              </div>
            )}
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                name="user_password"
                placeholder="Password"
              />
            </div>

            {passwordError && (
              <div className="error-message" style={{ color: "red" }}>
                <ul>
                  {passwordError.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <input type="submit" class="btn" value="Sign up" />
            <p class="social-text">Or Sign up with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div class="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              class="btn transparent"
              id="sign-up-btn"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>
          <img src={img} class="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div class="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              class="btn transparent"
              id="sign-in-btn"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </div>
          <img src={img2} class="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignInSignUpForm;