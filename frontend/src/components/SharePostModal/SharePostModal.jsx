import React, { useState } from 'react';
import "./sharePostModal.css"
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
const SharePostModal = ({ link, onClose }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
    };

    const splitData = link.split("/")
    const splitPostId = splitData[4];
    const splitUuid = splitData[5];

    // alert(splitPostId);
    // alert(splitUuid);

    return (
        <div className='sharePostContainer'>
            <p>Share this post:</p>
            <input type="text" value={link} readOnly />
            <a href={`/posts/${splitPostId}/${splitUuid}`}>
                {link}
            </a>
            <InsertLinkOutlinedIcon onClick={copyToClipboard} className='copyclipboard'/>
            {copied && <p>Link copied to clipboard!</p>}
            <button onClick={(e) => 
                {
                onClose();    
                e.stopPropagation(); }} className='copiedBtn'>Close</button>
        </div>
    );
};

export default SharePostModal;
