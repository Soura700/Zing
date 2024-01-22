// import './style.css';
// import Navbar from "./components/Navbar/Navbar"
// import Register from './pages/Register/Register';
// import Login from "./pages/Login/Login";
// import Home from "./pages/Home/Home";
// import Posts from "../src/components/Posts/Posts"

// import {
// createBrowserRouter,
// RouterProvider,
// Route,
// } from "react-router-dom";

// // import Profile from './pages/Profile/Profile';
// import LeftBar from './components/LeftBar/LeftBar';
// import RightBar from './components/RightBar/RightBar';
// import { useState } from 'react';

// function App() {

// const Layout = function(){

// // Toggling

// const [ toggle , setToggle ] = useState(false)

// const toggleMenu = ()=> {

// // alert("clicked")

// setToggle(!toggle);
// }

// return(
// <div>
// <Navbar toggleMenu={toggleMenu}/>
// <div style={{display:"flex", justifyContent: "space-between"}}>
// <LeftBar isVisible={toggle}/>
// <RightBar/>
// </div>
// {/* <Profile/> */}
// {/* <Posts/> */}
// </div>
// )
// }

// const router = createBrowserRouter([
// {
// path:"/",
// element:<Layout/>,
// children:[
// {
// path:"/home",
// element:<Home/>
// },
// {
// path:"/profile",
// // element:<Profile/>
// }
// ]
// },
// {
// path:"/login",
// element:<Login/>
// },
// {
// path:"/register",
// element:<Register/>
// },
// {
// path:"/profile",
// // element:<Profile/>
// }

// ]);

// return (

// <div>
// <RouterProvider router={router}/>
// </div>
// );
// }

// export default App;

import React from "react";
import "./style.css";
import Navbar from "./components/Navbar/Navbar";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { Leftbar2 } from "./components/messaging/Leftbar2";
import { Group } from "./components/Group/Group";
import Video from "./components/Video/Video.jsx";
import Personalization from "./pages/Personalization/YourComponent.jsx";

// import Posts from "../src/components/Posts/Posts"

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";

import Profile from "./pages/Profile/Profile";
import LeftBar from "./components/LeftBar/LeftBar";
import RightBar from "./components/RightBar/RightBar";
import { useState } from "react";
import SignInSignUpForm from "./components/SignInSignUpForm/SignInSignUpForm";
import { AuthProvider } from "./Contexts/authContext";
import Posts from "./components/Posts/Posts.jsx";
import { ToastContainer } from "react-toastify";
import CreateStory from "./components/Stories/CreateStory.jsx";
import { Let } from "./components/messaging/Let.jsx";

import VideoCall from "./pages/VideoCall/VideoCall.jsx"

function App() {
  const Layout = function () {
    // Toggling

    const [toggle, setToggle] = useState(false);

    const toggleMenu = () => {
      // alert("clicked")

      setToggle(!toggle);
    };

    return (
      <div>
        <ToastContainer />
        <Navbar toggleMenu={toggleMenu} />
        <div style={{ display: "flex" }}>
          <LeftBar isVisible={toggle} />
          <div style={{ flex: 6 }}>
            <React.StrictMode>
              <Outlet />
            </React.StrictMode>
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // <ProtectedRoute>
        <Layout />
        // </ProtectedRoute>
      ),
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
      ],
    },

    {
      path: "/login",
      element: <SignInSignUpForm />,
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
      path: "/call",
      element: <Video />,
    },


    {
      path: "/videoCall",
      element: <VideoCall />,
    },

  ]);

  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
