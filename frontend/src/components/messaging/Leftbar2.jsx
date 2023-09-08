// import React, { useEffect } from "react";
// import "./leftbar2.css";
// import image from "../../assets/jd-chow-gutlccGLXKI-unsplash.jpg";
// import SettingsIcon from "@mui/icons-material/Settings";
// import SearchIcon from "@mui/icons-material/Search";
// import TextsmsIcon from "@mui/icons-material/Textsms";
// import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
// import CallRoundedIcon from "@mui/icons-material/CallRounded";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import MicNoneIcon from "@mui/icons-material/MicNone";
// import TelegramIcon from "@mui/icons-material/Telegram";
// import CollectionsIcon from "@mui/icons-material/Collections";
// import VolumeOffIcon from "@mui/icons-material/VolumeOff";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import LockIcon from "@mui/icons-material/Lock";
// import BlockIcon from "@mui/icons-material/Block";
// import ReportIcon from "@mui/icons-material/Report";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useState } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "../../Contexts/authContext";

// const styles = {
//   "*": {
//     margin: 0,
//     padding: 0,
//     boxSizing: "border-box",
//   },
// };

// export const Leftbar2 = () => {

//   const { isLoggedIn, id ,  checkAuthentication } = useAuth();
//   const [toggle, setToggle] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const [messagess, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);

//   const parsedId  = parseInt(id);


//   useEffect(() => {
//     setSocket(io("http://localhost:5500"));
//   }, []);

//   useEffect(() => {//Calling the function when first render happens of the app...to update the isLoggeid from false to true..by checking the condition.
//     checkAuthentication(); // Call this when the component mounts
//   }, []);



//   useEffect(() => {

//     socket?.emit('addUser', parsedId ); // Make sure user ID 1 exists on the server
//     // Receiving the status from the backend (Active Users)
//     socket?.on('getUser', activeUsers => {
//       console.log("Active Users", activeUsers);
//       // alert(JSON.stringify(activeUsers)); // You can't directly alert an object, so stringify it
//     });

//   }, [socket]);
  

//   const handleToggle = () => {
//     setToggle(!toggle);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch("http://localhost:5000/api/conversation/get", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           senderId: 1,
//         }),
//       });
//       const data = await res.json();

//       setConversations(data);
//     };
//     fetchData();
//   }, []);

  

//   const fetchMessages = async (id) => {
//     const res = await fetch(
//       "http://localhost:5000/api/message/get_messages/" + id
//     );
//     const resJson = await res.json();
//     setMessages(resJson);
//   };

//   return (
//     <div style={styles} className="container">
//       {/* left-options bar */}

//       <div className="left-opt-menu">
//         <div className="container">
//           <div className="items">
//             <div className="profile-img">
//               <img src={image} alt="" />
//             </div>
//             <div className="item1">
//               <TextsmsIcon fontSize="medium" className="icon1" />
//             </div>
//             <div className="item2">
//               <PeopleRoundedIcon fontSize="medium" className="icon2" />
//             </div>
//             <div className="item3">
//               <CallRoundedIcon fontSize="medium" className="icon3" />
//             </div>
//             <hr></hr>
//             <div className="item4">
//               <SettingsRoundedIcon fontSize="medium" className="icon4" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* left - activity bar */}
//       <div className="left-menu">
//         <div className="top-part">
//           <div className="top-part-opt">
//             <h1>Messages</h1>
//           </div>
//           <div className="top-search-bar">
//             <input type="text" name="search-bar" placeholder="Search" />
//             <div className="search-btn">
//               <SearchIcon className="search-icon" />
//             </div>
//           </div>
//           <div className="mid-part">
//             <span>Pinned Messages</span>

//             {conversations.map((conversation, index) => {
//               // console.log(conversation.conversationId);

//               // alert(conversation.conversationId);

//               if (conversations.length > 0) {
//                 return (
//                   <div
//                     className="mid-text"
//                     key={index}
//                     onClick={() => fetchMessages(conversation.conversationId)}
//                   >
//                     <div className="left">
//                       <img
//                         src={image}
//                         alt=""
//                         onClick={() =>
//                           fetchMessages(conversation.conversationId)
//                         }
//                       />
//                       <div className="left-info">
//                         <h2 onClick={() => console.log("Hello")}>
//                           {conversation.conversationUserData[0].username}
//                         </h2>
//                         <p className="activity">Lorem, ipsum dolor.</p>
//                       </div>
//                     </div>
//                     <div className="right">
//                       <p>9:26 PM</p>
//                     </div>
//                   </div>
//                 );
//               } else {
//                 <div className="no-conversations">
//                   No conversations to show.
//                 </div>;
//               }
//             })}

//             <div className="mid-text3">
//               <div className="left3">
//                 <img src={image} alt=""></img>
//                 <div className="left-info">
//                   <h2>John Doe</h2>
//                   <p className="activity">whats up</p>
//                 </div>
//               </div>
//               <div className="right3">
//                 <p>9:26 PM</p>
//                 <circle>2</circle>
//               </div>
//             </div>

//             <span>All Conversations</span>

//             <div className="mid-text4">
//               <div className="left4">
//                 <img src={image} alt=""></img>
//                 <div className="left-info">
//                   <h2>John Doe</h2>
//                   <p className="activity">whats up</p>
//                 </div>
//               </div>
//               <div className="right4">
//                 <p>9:26 PM</p>
//                 <circle>11</circle>
//               </div>
//             </div>

//             <div className="mid-text5">
//               <div className="left5">
//                 <img src={image} alt=""></img>
//                 <div className="left-info">
//                   <h2>John Doe</h2>
//                   <p className="activity">typing...</p>
//                 </div>
//               </div>
//               <div className="right5">
//                 <p>9:26 PM</p>
//                 <circle>1</circle>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* main chat section */}

//       <div className="main-chat-section">
//         <div className="info">
//           <div className="left-part">
//             <div className="user-pic">
//               <img src={image} alt=""></img>
//             </div>
//             <div className="user-info">
//               <h1>John Doe</h1>
//               <p>Online</p>
//             </div>
//           </div>
//           <div className="right-part">
//             <CallRoundedIcon className="right-part-icon" />
//             <VideocamIcon className="right-part-icon" />
//             <MoreVertIcon className="right-part-icon" onClick={handleToggle} />
//             {toggle ? (
//               <div className="RightPopUpShow">
//                 <div className="PopUpBox">
//                   <div className="top">
//                     <img src={image} alt=""></img>
//                     <h1>John Doe</h1>
//                     <p>Online</p>
//                   </div>
//                   <div className="mid1">
//                     <CallRoundedIcon className="mid1-icon" />
//                     <VideocamIcon className="mid1-icon" />
//                   </div>
//                   <div className="mid2">
//                     <div className="userOpt">
//                       <CollectionsIcon className="right-part-icon" />
//                       <h2>Media</h2>
//                     </div>
//                   </div>
//                   <div className="mid3">
//                     <div className="userOpt">
//                       <VolumeOffIcon className="right-part-icon" />
//                       <h2>Mute Chat</h2>
//                     </div>
//                   </div>
//                   <div className="mid4">
//                     <div className="userOpt">
//                       <ArrowBackIosIcon className="right-part-icon" />
//                       <h2>Close Chat</h2>
//                     </div>
//                   </div>
//                   <div className="mid5">
//                     <div className="userOpt">
//                       <LockIcon className="right-part-icon" />
//                       <h2>Chat Lock</h2>
//                     </div>
//                   </div>
//                   <div className="bottom">
//                     <div className="userOpt1">
//                       <BlockIcon className="bottom-icon" />
//                       <h2>Block</h2>
//                     </div>
//                     <div className="userOpt2">
//                       <ReportIcon className="bottom-icon" />
//                       <h2>Report</h2>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="RightPopUpDefault"></div>
//             )}
//           </div>
//         </div>
//         <div className="inner-container">
//           {/* <div className="incoming-msg">Hi!</div>
//           <div className="outgoing-msg">How are you?</div> */}

//           {
//           messagess.length > 0 ? (
//             messagess.map((message,  index) => {
//               if(message.senderId === 1){
//                 return (
//                   <div className="outgoing-msg">
//                     {/* I am fine. Glad to text you after a long time! */}
//                     {message.message}
//                   </div>
//                 );
//               }else{
//                 return(
//                   <div className="incoming-msg">{message.message}</div>
//                 )
//               }
//             })
//           ) : (
//             <div className="no-conversations">No Messages to show.</div>
//           )}
//           {/* <div className="incoming-msg">
//             I am fine. Glad to text you after a long time!
//           </div>
//           <div className="outgoing-msg">
//             Lorem Ipsum is simply dummy text of the printing and typesetting
//             industry.
//           </div>
//           <div className="incoming-msg">Hi!</div>
//           <div className="outgoing-msg">How are you?</div>
//           <div className="incoming-msg">
//             I am fine. Glad to text you after a long time!
//           </div>
//           <div className="outgoing-msg">
//             Lorem Ipsum is simply dummy text of the printing and typesetting
//             industry.
//           </div>
//           <div className="incoming-msg">Hi!</div>
//           <div className="outgoing-msg">How are you?</div>
//           <div className="incoming-msg">
//             I am fine. Glad to text you after a long time!
//           </div>
//           <div className="outgoing-msg">
//             Lorem Ipsum is simply dummy text of the printing and typesetting
//             industry.
//           </div> */}
//         </div>
//         <div className="chat-bottom">
//           <div className="chat-input">
//             <input type="text" placeholder="Type a Message" />
//           </div>
//           <div className="chat-options">
//             <PhotoSizeSelectActualIcon className="chat-btn" />
//             <LocationOnIcon className="chat-btn" />
//             <MicNoneIcon className="chat-btn" />
//           </div>
//           <div className="submit-btn-class">
//             <button>
//               <TelegramIcon className="submit-btn" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



import React, { useEffect } from "react";
import "./leftbar2.css";
import image from "../../assets/jd-chow-gutlccGLXKI-unsplash.jpg";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicNoneIcon from "@mui/icons-material/MicNone";
import TelegramIcon from "@mui/icons-material/Telegram";
import CollectionsIcon from "@mui/icons-material/Collections";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LockIcon from "@mui/icons-material/Lock";
import BlockIcon from "@mui/icons-material/Block";
import ReportIcon from "@mui/icons-material/Report";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/authContext";

export const Leftbar2 = () => {
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messagess, setMessages] = useState([]);
  const [message , setMessage]  = useState('')
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const parsedId = parseInt(id);

  console.log(messagess , 'messages');

  const styles = {
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
};

  useEffect(() => {
    setSocket(io("http://localhost:5500"));
  }, []);

  useEffect(() => {
    checkAuthentication().then(() => {
      setIsLoading(false); // Mark loading as complete when authentication data is available
    });
  }, [checkAuthentication]);

    const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    // Only perform socket-related operations if the user is authenticated
    if (isLoggedIn) {
      socket?.emit("addUser", parsedId);
      socket?.on("getUser", (activeUsers) => {
        console.log("Active Users", activeUsers);
      });
      socket.on("getMessage",data=>{
        console.log(data);
        setMessages(prev=>({
          ...prev,
          messagess: [...prev.messagess ,{ message:data.message } ]
        }))
      })
    }
  }, [socket, parsedId, isLoggedIn]);
  

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        const res = await fetch("http://localhost:5000/api/conversation/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: 1,
          }),
        });
        const data = await res.json();
        setConversations(data);
      };
      fetchData();
    }
  }, [isLoggedIn]);


  const fetchMessages = async (id) => {
    if (isLoggedIn) {
      const res = await fetch(
        "http://localhost:5000/api/message/get_messages/" + id
      );
      const resJson = await res.json();
      setMessages(resJson);
      console.log(resJson);
    }
  };

  // const fetchMessages = async (id) => {
  //   if (isLoggedIn) {
  //     const res = await fetch("http://localhost:5000/api/message/get_messages/" + id , {
  //       method:"GET",
  //       headers:{
  //         'Content-Type':'application/json'
  //       },
  //       body:JS
  //     });
  //     const resJson = await res.json();
  //     setMessages(resJson);
  //     console.log(resJson);
  //   }
  // };



  const sendMessage = async (e)=>{

    const conversationId = messagess[0].conversationId; 

    socket?.emit("sendMessage",{
      conversationId:conversationId,
      senderId:parsedId,
      message:message,
      receiverId:messagess?.receiver?.receiverId
    });

  try{

    if (!messagess || !messagess.length) {
      console.error("No conversation selected");
      return;
    }



    const res = await fetch("http://localhost:5000/api/message/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        conversationId:conversationId,
        senderId:parsedId,
        message:message,
        // receiverId:""
      })
    })
    if (res.status === 200) {
      // Message sent successfully to the API, now emit it to the server
      // socket?.emit("sendMessage", {
      //   senderId: parsedId,
      //   receiverId: /* Receiver's ID goes here */,
      //   message: message,
      // });

      // Clear the input field after sending
      setMessage('');
    } else {
      console.error("Failed to send message to the API");
      // Handle error appropriately, e.g., show an error message to the user
    }
  }catch(error){
    console.error("Error sending message:", error);
  }
}

  // Render loading indicator if still loading authentication data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the rest of your component based on the authentication status
  return (
    <div style={styles} className="container">
      {/* left-options bar */}

      <div className="left-opt-menu">
        <div className="container">
          <div className="items">
            <div className="profile-img">
              <img src={image} alt="" />
            </div>
            <div className="item1">
              <TextsmsIcon fontSize="medium" className="icon1" />
            </div>
            <div className="item2">
              <PeopleRoundedIcon fontSize="medium" className="icon2" />
            </div>
            <div className="item3">
              <CallRoundedIcon fontSize="medium" className="icon3" />
            </div>
            <hr></hr>
            <div className="item4">
              <SettingsRoundedIcon fontSize="medium" className="icon4" />
            </div>
          </div>
        </div>
      </div>

      {/* left - activity bar */}
      <div className="left-menu">
        <div className="top-part">
          <div className="top-part-opt">
            <h1>Messages</h1>
          </div>
          <div className="top-search-bar">
            <input type="text" name="search-bar" placeholder="Search" />
            <div className="search-btn">
              <SearchIcon className="search-icon" />
            </div>
          </div>
          <div className="mid-part">
            <span>Pinned Messages</span>

            {
              // conversations.length>0?
            conversations.map((conversation, index) => {
              // console.log(conversation.conversationId);

              // alert(conversation.conversationId);
              

              if (conversations.length > 0) {
                return (
                  <div
                    className="mid-text"
                    key={index}
                    onClick={() => fetchMessages(conversation.conversationId)}
                  >
                    <div className="left">
                      <img
                        src={image}
                        alt=""
                        onClick={() =>
                          fetchMessages(conversation.conversationId)
                        }
                      />
                      <div className="left-info">
                        <h2 onClick={() => console.log("Hello")}>
                        {/* {conversation.conversationUserData[0].username} */}
                        {conversation.user.username}
                        </h2>
                        <p className="activity">Lorem, ipsum dolor.</p>
                      </div>
                    </div>
                    <div className="right">
                      <p>9:26 PM</p>
                    </div>
                  </div>
                );
              } else {
                <div className="no-conversations">
                  No conversations to show.
                </div>;
              }
            })}

            <div className="mid-text3">
              <div className="left3">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">whats up</p>
                </div>
              </div>
              <div className="right3">
                <p>9:26 PM</p>
                <circle>2</circle>
              </div>
            </div>

            <span>All Conversations</span>

            <div className="mid-text4">
              <div className="left4">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">whats up</p>
                </div>
              </div>
              <div className="right4">
                <p>9:26 PM</p>
                <circle>11</circle>
              </div>
            </div>

            <div className="mid-text5">
              <div className="left5">
                <img src={image} alt=""></img>
                <div className="left-info">
                  <h2>John Doe</h2>
                  <p className="activity">typing...</p>
                </div>
              </div>
              <div className="right5">
                <p>9:26 PM</p>
                <circle>1</circle>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* main chat section */}

      <div className="main-chat-section">
        <div className="info">
          <div className="left-part">
            <div className="user-pic">
              <img src={image} alt=""></img>
            </div>
            <div className="user-info">
              <h1>John Doe</h1>
              <p>Online</p>
            </div>
          </div>
          <div className="right-part">
            <CallRoundedIcon className="right-part-icon" />
            <VideocamIcon className="right-part-icon" />
            <MoreVertIcon className="right-part-icon" onClick={handleToggle} />
            {toggle ? (
              <div className="RightPopUpShow">
                <div className="PopUpBox">
                  <div className="top">
                    <img src={image} alt=""></img>
                    <h1>John Doe</h1>
                    <p>Online</p>
                  </div>
                  <div className="mid1">
                    <CallRoundedIcon className="mid1-icon" />
                    <VideocamIcon className="mid1-icon" />
                  </div>
                  <div className="mid2">
                    <div className="userOpt">
                      <CollectionsIcon className="right-part-icon" />
                      <h2>Media</h2>
                    </div>
                  </div>
                  <div className="mid3">
                    <div className="userOpt">
                      <VolumeOffIcon className="right-part-icon" />
                      <h2>Mute Chat</h2>
                    </div>
                  </div>
                  <div className="mid4">
                    <div className="userOpt">
                      <ArrowBackIosIcon className="right-part-icon" />
                      <h2>Close Chat</h2>
                    </div>
                  </div>
                  <div className="mid5">
                    <div className="userOpt">
                      <LockIcon className="right-part-icon" />
                      <h2>Chat Lock</h2>
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="userOpt1">
                      <BlockIcon className="bottom-icon" />
                      <h2>Block</h2>
                    </div>
                    <div className="userOpt2">
                      <ReportIcon className="bottom-icon" />
                      <h2>Report</h2>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="RightPopUpDefault"></div>
            )}
          </div>
        </div>
        <div className="inner-container">
          {/* <div className="incoming-msg">Hi!</div>
          <div className="outgoing-msg">How are you?</div> */}

          {
          messagess.length > 0 ? (
            messagess.map( ( { message, user:{ id } = {} , index }) => {
              // if(message.senderId === 1){
                if( id ===  parsedId ){
                return (
                  <div className="outgoing-msg">
                    {/* I am fine. Glad to text you after a long time! */}
                    {/* {message.message} */}
                    {message}
                  </div>
                );
              }else{
                return(
                  // <div className="incoming-msg">{message.message}</div>
                  <div className="incoming-msg">{message}</div>
                )
              }
            })
          ) : (
            <div className="no-conversations">No Messages to show.</div>
          )}
          {/* <div className="incoming-msg">
            I am fine. Glad to text you after a long time!
          </div>
          <div className="outgoing-msg">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </div>
          <div className="incoming-msg">Hi!</div>
          <div className="outgoing-msg">How are you?</div>
          <div className="incoming-msg">
            I am fine. Glad to text you after a long time!
          </div>
          <div className="outgoing-msg">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </div>
          <div className="incoming-msg">Hi!</div>
          <div className="outgoing-msg">How are you?</div>
          <div className="incoming-msg">
            I am fine. Glad to text you after a long time!
          </div>
          <div className="outgoing-msg">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </div> */}
        </div>
        <div className="chat-bottom">
          <div className="chat-input">
            <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)}   placeholder="Type a Message" />
          </div>
          <div className="chat-options">
            <PhotoSizeSelectActualIcon className="chat-btn" />
            <LocationOnIcon className="chat-btn" />
            <MicNoneIcon className="chat-btn" />
          </div>
          <div className="submit-btn-class">
            <button onClick={()=>sendMessage()}>
              <TelegramIcon className="submit-btn"  />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
