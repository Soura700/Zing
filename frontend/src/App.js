// import './style.css';
// import Navbar from "./components/Navbar/Navbar"
// import Register from './pages/Register/Register';
// import Login from "./pages/Login/Login";
// import Home from "./pages/Home/Home";
// import Posts from "../src/components/Posts/Posts"

// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
// } from "react-router-dom";

// // import Profile from './pages/Profile/Profile';
// import LeftBar from './components/LeftBar/LeftBar';
// import RightBar from './components/RightBar/RightBar';
// import { useState } from 'react';


// function App() {

//   const Layout = function(){

//     // Toggling 

//     const [ toggle , setToggle ] = useState(false)



//     const toggleMenu =  ()=> {

//         // alert("clicked")

//         setToggle(!toggle);
//     }


//     return(
//       <div>
//         <Navbar toggleMenu={toggleMenu}/>
//         <div style={{display:"flex", justifyContent: "space-between"}}>
//             <LeftBar isVisible={toggle}/>
//             <RightBar/>
//         </div>
//         {/* <Profile/> */}
//         {/* <Posts/> */}
//       </div>
//     )
//   }

//   const router = createBrowserRouter([
//     {
//       path:"/",
//       element:<Layout/>,
//       children:[
//         {
//           path:"/home",
//           element:<Home/>
//         },
//         {
//           path:"/profile",
//           // element:<Profile/>
//         }
//       ]
//     },
//     {
//       path:"/login",
//       element:<Login/>
//     },
//     {
//       path:"/register",
//       element:<Register/>
//     },
//     {
//       path:"/profile",
//       // element:<Profile/>
//     }

//   ]);

//   return (

//     <div>
//       <RouterProvider router={router}/>
//     </div>
//   );
// }

// export default App;


import React from "react";
import './style.css';
import Navbar from "./components/Navbar/Navbar"
import Register from './pages/Register/Register';
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
// import { Leftbar2 } from './components/messaging/Leftbar2';
// import Posts from "../src/components/Posts/Posts"

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";

import Profile from './pages/Profile/Profile';
import LeftBar from './components/LeftBar/LeftBar';
import RightBar from './components/RightBar/RightBar';
import { useState } from 'react';
// import { Message } from './pages/Message_Page/Message';
import { Leftbar2 } from "./components/messaging/Leftbar2";


function App() {

  const Layout = function () {

    // Toggling 

    const [toggle, setToggle] = useState(false)



    const toggleMenu = () => {

      // alert("clicked")

      setToggle(!toggle);
    }


    return (
      <div>
        {/* <Navbar toggleMenu={toggleMenu} /> */}
        <div style={{ display: "flex" }}>
          {/* <LeftBar isVisible={toggle}/> */}
          <div style={{ flex: 6 }}>
          <React.StrictMode>
            <Outlet />
          </React.StrictMode>
          </div>
          {/* <RightBar /> */}
        </div>
      </div>
    );
  }

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
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/message",
          element: <Leftbar2/>,
        },
      ],

    },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);


  return (

    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
