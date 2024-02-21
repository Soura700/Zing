import axios from "axios";
import img6 from "../../assets/img6.png";
import img7 from "../../assets/img7.png";
import img from "../../assets/img.svg";
import img2 from "../../assets/img1svg.svg";
import "./sign.css";
import "./sign.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';


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

  const [showPassword, setShowPassword] = useState(false);

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const clearSignInEmailError = () => {
    setSignInEmailError("");
  };

  const clearSignInPasswordError = () => {
    setSignInPasswordError([]);
  };

  const clearEmailError = () => {
    setEmailError("");
  };

  const clearPasswordError = () => {
    setPasswordError([]);
  };

  const handleGoogleLoginError = () => {
    // Redirect to login home page
    navigate("/login");
  };

  //login with google (31/01/2024) biggo
  const loginwithgoogle = () => {
    try {
      window.open("https://zing-media.onrender.com/auth/google/callback", "_self");
    } catch (error) {
      handleGoogleLoginError();
    }
  };

  // Handle sign in
  const handleSubmitSignIn = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(
        "https://zing-media.onrender.com/api/auth/login",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/"); //On successfull redirect to the home page
      }

      // Handle success or redirect the user
    } catch (error) {
      // If password is incorrect then Wrong Credentials
      if (error.response.status === 401) {
        // Show a popup or alert indicating that the user already exists
        toast.error("Wrong Credentials");
      }

      // If the email is incorrect then user not found
      else if (error.response.status === 404) {
        toast.error("User not found!!!");
      } else {
        if (error.response && error.response.data) {
          const messagesArray = error.response.data.split("@");

          // Display a toast for each error message
          messagesArray.forEach((message) => {
            if (message.includes("Email") || message.includes("Password")) {
              toast.error(message);
            }
          });

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

    try {
      const response = await axios.post(
        "https://zing-media.onrender.com/api/auth/register",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("isNewUser", "true");
        navigate(`/profile_setting/` + response.data.insertId);
      }

      // Handle success or redirect the user
    } catch (error) {
      if (error.response.status === 409) {
        // Show a popup or alert indicating that the user already exists
        toast.error(
          "User Already Registered ... Try differenet mail or username"
        );
      } else {
        if (error.response && error.response.data) {
          const messagesArray = error.response.data.split("@");

          // Display a toast for each error message
          messagesArray.forEach((message) => {
            if (
              message.includes("Email") ||
              message.includes("Password") ||
              message.includes("Username")
            ) {
              toast.error(message);
            }
          });

          // Find the specific error messages for email and password
          const emailError = messagesArray.find((message) =>
            message.includes("Email")
          );
          const passwordError = messagesArray.filter((message) =>
            message.includes("Password")
          );
          setErrorMessages(messagesArray);
          setEmailError(emailError || "");
          setPasswordError(passwordError || "");
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

            <div class="input-field">
              <i class="fas fa-user"></i>
              <input
                type="email"
                name="email"
                onChange={clearSignInEmailError}
                placeholder="Email"
              />
            </div>

            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="user_password"
                onChange={clearSignInPasswordError}
                placeholder="Password"
              />
              {showPassword ? (
                <VisibilityOffRoundedIcon
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <VisibilityRoundedIcon
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>


            <input type="submit" value="Login" class="btn solid" />
            <p>
              <Link to="/forgotpassword">Forgot Password?</Link>
            </p>
            <p class="social-text">Or</p>
            <div class="social-media">
              {/* <a href="#" class="social-icon">
                <i class="fa-brands fa-facebook"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-twitter"></i>
              </a> */}
              <a class="social-icon" onClick={loginwithgoogle}>
                <i class="fab fa-google" onClick={loginwithgoogle}></i>
                Sign in with Google
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
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" name="username" placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                onChange={clearEmailError}
                placeholder="Email"
              />
            </div>

            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="user_password"
                onChange={clearPasswordError}
                placeholder="Password"
              />
              {showPassword ? (
                <VisibilityOffRoundedIcon
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <VisibilityRoundedIcon
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>

            <input type="submit" class="btn" value="Sign up" />
            <p class="social-text">Or</p>
            <div class="social-media">
              {/* <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-twitter"></i>
              </a> */}
              <a href="#" class="social-icon">
                <i class="fab fa-google" onClick={loginwithgoogle}></i>
                Sign up with Google
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
              Join our vibrant community of adventurers, creators, and dreamers.
              Sign up now!
            </p>
            <button
              class="btn transparent"
              id="sign-up-btn"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>
          {/* <img src={img} class="image" alt="" /> */}
          <img src={img6} class="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div class="content">
            <h3>One of us ?</h3>
            <p>Welcome back, explorer! Your next adventure awaits.</p>
            <button
              class="btn transparent"
              id="sign-in-btn"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </div>
          <img src={img7} class="image" alt="" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignInSignUpForm;
