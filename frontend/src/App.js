import React, { useState, useEffect } from "react";
import "./style.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import { Group } from "./components/Group/Group";
import Personalization from "./pages/Personalization/YourComponent.jsx";
import Profile from "./pages/Profile/Profile";
import LeftBar from "./components/LeftBar/LeftBar";
import RightBar from "./components/RightBar/RightBar";
import SignInSignUpForm from "./components/SignInSignUpForm/SignInSignUpForm";
import ForgotPasswordForm from "./components/SignInSignUpForm/ForgotPasswordForm.js";
import ResetPasswordForm from "./components/SignInSignUpForm/ResetPasswordForm.js";
import { AuthProvider } from "./Contexts/authContext";
import Posts from "./components/Posts/Posts.jsx";
import { ToastContainer } from "react-toastify";
import CreateStory from "./components/Stories/CreateStory.jsx";
import { Let } from "./components/messaging/Let.jsx";
import VideoCall from "./pages/VideoCall/VideoCall.jsx";
import Loading from "../src/components/Loading.jsx";
import Saved from "./pages/Saved/Saved.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Tour from "react-joyride";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "./Contexts/themeContext.js";
import ViewSharePost from "./components/SharePostModal/ViewSharePost.jsx";

import styles from "./components/Navbar/navbar.module.css"; // Import Navbar CSS module
import leftBarStyles from "./components/LeftBar/leftBar.module.css"; // Import LeftBar CSS module
import rightBarStyles from "./components/RightBar/rightbar.module.css"; // Import LeftBar CSS module

function App() {
  const [tourIndex, setTourIndex] = useState(-1); // Start with -1 to prevent any popup initially
  const [isNewUser, setIsNewUser] = useState(false);

  // useEffect(() => {
  //   // Automatically start the tour when component mounts
  //   setTourIndex(0);
  // }, []);

  useEffect(() => {
    const isNewUser = localStorage.getItem("isNewUser");
    setIsNewUser(isNewUser === "true");

    // If it's a new user, start the tour
    if (isNewUser === "true") {
      setTourIndex(0);
    }
  }, []);

  const tourSteps = [
    {
      target: `.${styles.navbar}`,
      content:
        "From here you can search for your friends and check out the Notifications and Messages you have and access your Profile page from here",
    },
    {
      target: `.${leftBarStyles.container}`,
      content:
        "From here you can check out your saved posts from Saved or update your profile by going to the Settings.",
    },
    {
      target: `.${rightBarStyles.item}`,
      content:
        "From here you can get suggestions of Friends and updates on what your Friends are up to."
  }

    // Add more steps as needed
  ];

  const [runTour, setRunTour] = useState(true);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const isNewUser = localStorage.getItem("isNewUser");
    setIsNewUser(isNewUser === "true");
    // Simulate loading delay
    const timeout = setTimeout(() => {
      setLoading(false); // Set loading to false after a delay (e.g., 2000 milliseconds)
    }, 2000);

    return () => clearTimeout(timeout); // Cleanup function to clear the timeout
  }, []);



  const Layout = function () {
    // Toggling
    const [toggle, setToggle] = useState(false);
    const toggleMenu = () => {
      setToggle(!toggle);
    };
    const handleLastStep = (data)=>{
      if (
        data.index === tourSteps.length - 1 && // Check if it's the last step
        data.type === "step:before" && // Check if it's before showing the step
        data.step.target === `.${rightBarStyles.item}` // Check if the target matches the right bar
      ) {
       localStorage.removeItem("isNewUser")
      }
    }


    return (
      <div>
        <ToastContainer />
        <Navbar toggleMenu={toggleMenu} />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <React.StrictMode>
              <Outlet />
            </React.StrictMode>
          </div>
          <RightBar isVisible={toggle} />
        </div>
        <Tour
          steps={tourSteps}
          run={isNewUser}
          continuous={true}
          styles={{
            options: {
              arrowColor: "rgb(78, 60, 114)", // Change the color of the arrow
              backgroundColor: "white", // Change the background color of the pop-up
              primaryColor: "rgb(78, 60, 114)",
              // Change the primary color of the pop-up (e.g., buttons)
              textColor: "black", // Change the text color
            },
            spotlight: {
              height: "100vh",
            },
            tooltip: {
              fontSize: "16px", // Change the font size of the tooltip text
              padding: "30px",
              // Add padding to the tooltip
              //  marginTop: '50px',
              marginLeft: "20px",
            },
            // body: {
            //   marginTop: '50px',
            // },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Change the color of the beacon
              textColor: "white", // Change the text color of the beacon
            },
            beacon: {
              backgroundColor: "white", // Change the color of the beacon
              textColor: "white",
              marginTop: "30px", // Change the text color of the beacon
            },
            button: {
              backgroundColor: "green",
            },
          }}
          callback={handleLastStep} 
        />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: loading ? <Loading /> : <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:userId",
          element: <Profile />,
        },
        {
          path: "/posts",
          element: <Posts />,
        },
        {
          path: "/saved/:userId",
          element: <Saved />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },

    {
      path: "/login",
      element: <SignInSignUpForm />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPasswordForm />,
    },
    {
      path: "/resetpassword/:id/:token",
      element: <ResetPasswordForm />,
    },
    {
      path: "/posts/:postid/:uuid",
      element: <ViewSharePost />,
    },
    {
      path: "/profile_setting/:userId",
      element: <Personalization />,
    },

    {
      path: "/message",
      element: <Let />,
    },

    {
      path: "/groupmessage",
      element: <Group />,
    },

    {
      path: "/create_story",
      element: <CreateStory />,
    },
    {
      path: "/videocall",
      element: <VideoCall />,
    },
  ]);

  return (
    <ThemeProvider>
      <div>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
