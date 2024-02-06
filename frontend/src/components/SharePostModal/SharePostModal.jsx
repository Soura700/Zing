import React, { useState } from 'react';

const SharePostModal = ({ link, onClose }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
    };

    const splitData = link.split("/")
    const splitPostId = splitData[4];
    const splitUuid = splitData[5];

    alert(splitPostId);
    alert(splitUuid);

    return (
        <div>
            <p>Share this post:</p>
            <input type="text" value={link} readOnly />
            <a href={`/posts/${splitPostId}/${splitUuid}`}>
                {link}
            </a>
            <button onClick={copyToClipboard}>Copy Link</button>
            {copied && <p>Link copied to clipboard!</p>}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default SharePostModal;
