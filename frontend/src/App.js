// import React from "react";
// import "./style.css";
// import Navbar from "./components/Navbar/Navbar";
// import Home from "./pages/Home/Home";
// import { Group } from "./components/Group/Group";
// import Personalization from "./pages/Personalization/YourComponent.jsx";
// import Saved from "./pages/Saved/Saved.jsx";
// import Profile from "./pages/Profile/Profile";
// import LeftBar from "./components/LeftBar/LeftBar";
// import RightBar from "./components/RightBar/RightBar";
// import { useState } from "react";
// import SignInSignUpForm from "./components/SignInSignUpForm/SignInSignUpForm";
// import ForgotPasswordForm from "./components/SignInSignUpForm/ForgotPasswordForm.js";
// import ResetPasswordForm from "./components/SignInSignUpForm/ResetPasswordForm.js";
// import { AuthProvider } from "./Contexts/authContext";
// import Posts from "./components/Posts/Posts.jsx";
// import { ToastContainer } from "react-toastify";
// import CreateStory from "./components/Stories/CreateStory.jsx";
// import { Let } from "./components/messaging/Let.jsx";
// import VideoCall from "./pages/VideoCall/VideoCall.jsx";
// // import Posts from "../src/components/Posts/Posts"
// import Loading from "../src/components/Loading.jsx";
// import { useEffect } from "react";

// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
//   Outlet,
// } from "react-router-dom";
// import { ThemeProvider } from "./Contexts/themeContext.js";
// import ViewSharePost from "./components/SharePostModal/ViewSharePost.jsx";

// function App() {
//   const [loading, setLoading] = useState(true); // State to track loading status

//   useEffect(() => {
//     // Simulate loading delay
//     const timeout = setTimeout(() => {
//       setLoading(false); // Set loading to false after a delay (e.g., 2000 milliseconds)
//     }, 2000);

//     return () => clearTimeout(timeout); // Cleanup function to clear the timeout
//   }, []);

//   const Layout = function () {
//     // Toggling
//     const [toggle, setToggle] = useState(false);
//     const toggleMenu = () => {
//       // alert("clicked")
//       setToggle(!toggle);
//     };

//     return (
//       <div>
//         <ToastContainer />
//         <Navbar toggleMenu={toggleMenu} />
//         <div style={{ display: "flex" }}>
//           {/* <RightBar isVisible={toggle}/> */}
//           <LeftBar />
//           <div style={{ flex: 6 }}>
//             {loading ? (
//               <Loading />
//             ) : (
//               <React.StrictMode>
//                 <Outlet />
//               </React.StrictMode>
//             )}
//             {/* <React.StrictMode>
//               <Outlet />
//             </React.StrictMode> */}
//           </div>
//           <RightBar isVisible={toggle} />
//         </div>
//       </div>
//     );
//   };

//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: (
//         // <ProtectedRoute>
//         <Layout />
//         // </ProtectedRoute>
//       ),
//       children: [
//         {
//           path: "/",
//           element: <Home />,
//         },
//         {
//           path: "/profile/:userId",
//           element: <Profile />,
//         },
//         {
//           path: "/posts",
//           element: <Posts />,
//         },
//         {
//           path: "/saved",
//           element: <Saved />,
//         },
//       ],
//     },

//     {
//       path: "/login",
//       element: <SignInSignUpForm />,
//     },
//     {
//       path: "/forgotpassword",
//       element: <ForgotPasswordForm />,
//     },
//     {
//       path: "/resetpassword/:id/:token",
//       element: <ResetPasswordForm />,
//     },
//     {
//       path: "/posts/:postid/:uuid",
//       element: <ViewSharePost />,
//     },
//     {
//       path: "/profile_setting/:userId",
//       element: <Personalization />,
//     },

//     {
//       path: "/message",
//       element: <Let />,
//     },
//     // {
//     //   path: "/message",
//     //   element: <Leftbar2 />,
//     // },

//     {
//       path: "/groupmessage",
//       element: <Group />,
//     },

//     {
//       path: "/create_story",
//       element: <CreateStory />,
//     },
//     {
//       path: "/videocall",
//       element: <VideoCall />,
//     },
//   ]);

//   return (
//     <ThemeProvider>
//       <div>
//         <AuthProvider>
//           <RouterProvider router={router} />
//         </AuthProvider>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;

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
// import Posts from "../src/components/Posts/Posts"

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "./Contexts/themeContext.js";
import ViewSharePost from "./components/SharePostModal/ViewSharePost.jsx";

function App() {
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect((e) => {
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
