import React, { useState } from "react";
import "./sharePostModal.css";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
const SharePostModal = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  // const copyToClipboard =  () => {
  //    navigator.clipboard.writeText(link);
  //   setCopied(true);
  // };

  const copyToClipboard = () => {
    const anchorTag = `<a href="/posts/${splitPostId}/${splitUuid}">${link}</a>`; // Create anchor tag HTML
    const tempElement = document.createElement("textarea"); // Create a temporary element
    tempElement.value = anchorTag; // Set the value of the temporary element to the anchor tag HTML
    document.body.appendChild(tempElement); // Append the temporary element to the DOM
    tempElement.select(); // Select the text inside the temporary element
    document.execCommand("copy"); // Copy the selected text to clipboard
    document.body.removeChild(tempElement); // Remove the temporary element from the DOM
    setCopied(true);
  };
  

  const splitData = link.split("/");
  const splitPostId = splitData[4];
  const splitUuid = splitData[5];

  // alert(splitPostId);
  // alert(splitUuid);

  return (
    <div className="sharePostContainer">
      <h3>Share this post:</h3>
      <input type="text" value={link} readOnly />
      <a href={`/posts/${splitPostId}/${splitUuid}`}>{link}</a>
      <div className="copyclipboard">
        <p>Copy</p>
        <InsertLinkOutlinedIcon onClick={copyToClipboard} />
      </div>

      {copied && <p className="linkCopied">Link copied to clipboard!</p>}
      <button
        onClick={(e) => {
          onClose();
          e.stopPropagation();
        }}
        className="copiedBtn"
      >
        Close
      </button>
    </div>
  );
};

export default SharePostModal;

// import React, { useState, useEffect } from "react";
// import "./sharePostModal.css";
// import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

// const SharePostModal = ({ link, onClose }) => {
//   const [copied, setCopied] = useState(false);
//   const [inputValue, setInputValue] = useState(link); // Initialize input value with link prop

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(link);
//     setCopied(true);
//   };

//   useEffect(() => {
//     // Update input value when link prop changes
//     setInputValue(link);
//   }, [link]);

//   useEffect(() => {
//     let timeout;
//     if (copied) {
//       // Reset the copied state after 2 seconds
//       timeout = setTimeout(() => {
//         setCopied(false);
//       }, 2000);
//     }
//     return () => clearTimeout(timeout);
//   }, [copied]);

//   const splitData = link.split("/");
//   const splitPostId = splitData[4];
//   const splitUuid = splitData[5];

//   return (
//     <div className="sharePostContainer">
//       <h3>Share this post:</h3>
//       <input type="text" value={inputValue} readOnly />
//       <div className="copyclipboard">
//         <p>Copy</p>
//         <InsertLinkOutlinedIcon onClick={copyToClipboard} />
//       </div>

//       {copied && <p className="linkCopied">Link copied to clipboard!</p>}
//       <button
//         onClick={(e) => {
//           onClose();
//           e.stopPropagation();
//         }}
//         className="copiedBtn"
//       >
//         Close
//       </button>
//     </div>
//   );
// };

// export default SharePostModal;
