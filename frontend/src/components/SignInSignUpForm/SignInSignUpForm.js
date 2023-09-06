import axios from 'axios';
import img from '../../assets/img.svg';
import img2 from "../../assets/img1svg.svg";
import './sign.css';
// import styles from "./sign.module.css"
import React, { useState } from "react";
  
// signupform
 
const SignInSignUpForm = () => {

  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignInClick = () => {
    
    setIsSignUp(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };


  const handleSubmitSignIn = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", data ,
      {
        withCredentials:true,
      }
      );
      console.log("Login response:", response.data);
      // Handle success or redirect the user
    } catch (error) {
      console.error("Login error:", error);
      // Handle error
    }
  };

  const handleSubmitSignUp = async (event) => {

    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    try {

      const response = await axios.post("http://localhost:5000/api/auth/register", data , {
        withCredentials:true,
      });
      
      console.log(response);

      console.log("Register response:", response.data);
      // Handle success or redirect the user
      
    } catch (error) {
      console.error("Register error:", error);
      // Handle error
    }
  };


  return (
    <div className={`sign_container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn} method='post' className="sign-in-form">
          <h2 class="title">Sign in</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="email" name='email' placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" name='user_password' placeholder="Password" />
            </div>
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
          <form action="#" onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn} method="post" className="sign-up-form">
          <h2 class="title">Sign up</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" name='username' placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input type="email" name='email' placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" name='user_password' placeholder="Password" />
            </div>
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
            <button class="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
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
            <button class="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
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