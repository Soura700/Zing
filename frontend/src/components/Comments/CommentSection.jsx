import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../../Contexts/authContext';


const CommentSection = ({ postId, userId , userName }) => {

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [username,setUsername] = useState(null)
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const { isLoggedIn, id, checkAuthentication } = useAuth();
  const parsedID = parseInt(id);



  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuthentication();
        const userRes = await fetch('http://localhost:5000/api/auth/' + id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const userDetails = await userRes.json();
        setUsername(userDetails[0].username);
        // setUserPhoto(userDetails[0].profileImg);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };


    if (id && parsedID) {
      Promise.all([fetchData()])
        //.then(() => setIsLoading(false))
        .catch((error) => console.error('Error during data fetching:', error));
    }
  }, [id, parsedID, checkAuthentication]);

  alert(username);


  useEffect(()=>{
    async function fetchComments (){
    try{
        const res = await fetch(`http://localhost:5000/api/comment/get_comments/${postId}`)
        const data = await res.json();
        setComments(data);
        } catch (err) {
            console.error(err);
        }
    }
    fetchComments();
  },[postId])


  useEffect(() => {
    if (socket) {
      socket.on('comment', ({ comment, postid, userid }) => {
        if (userid !== userId) {
          if (postid === postId) {
            setComments((prevComments) => [...prevComments, comment]);
          }
        }
      });

      socket.on('deleteComment', ({comment,commentId}) => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, postId]);

  const handleComment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/comment/create_comments',
        {
          postId: postId,
          userId: userId,
          userName:username,
          text: newComment,
        }
      );
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comment/delete_comments/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeDifferenceString = (timestamp) => {
    const currentDate = new Date();
    const timestampDate = new Date(timestamp);
    const timeDifferenceMilliseconds = currentDate - timestampDate;
    const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);
  
    if (timeDifferenceSeconds < 60) {
      return `${timeDifferenceSeconds} seconds ago`;
    } else if (timeDifferenceMinutes < 60) {
      return `${timeDifferenceMinutes} minutes ago`;
    }else if (timeDifferenceHours < 24) {
      return `${timeDifferenceHours} hours ago`;
    }else{
      return `${timeDifferenceDays} days ago`;
    }
  };


  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      {comments.map((comment) => (
        <div
          key={comment._id}
          style={commentStyle}>
         <h1>{comment.userName}</h1>
         <h1>{getTimeDifferenceString(comment.createdAt)}</h1>
          <p>{comment.text}</p>
          {comment.userId === userId && (
            <button
              style={deleteButtonStyle}
              onClick={() => handleDeleteComment(comment._id)}>
              Delete
            </button>
          )}
        </div>
      ))}

      <div style={commentInputContainerStyle}>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={commentInputStyle}
        />
        <button
          style={commentButtonStyle}
          onClick={handleComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
};

const commentStyle = {
  backgroundColor: '#f2f2f2',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '5px',
};

const deleteButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
};

const commentInputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '20px',
};

const commentInputStyle = {
  flex: '1',
  padding: '8px',
  marginRight: '10px',
};

const commentButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
};

export default CommentSection;
