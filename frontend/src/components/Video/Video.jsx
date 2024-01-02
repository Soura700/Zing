import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:5500');


  

function Video() {
  const myVideo = useRef();
  const peerVideo = useRef();
  const peerRef = useRef();
  const peerAudio = useRef(); // Add a reference for audio

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;

        console.log(stream);

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        peer.on('signal', (data) => {
          socket.emit('offer', { target: 'target-user-id', data: data });
        });

        peer.on('stream', (stream) => {
          peerVideo.current.srcObject = stream;
          peerAudio.current.srcObject = stream;
        });

        socket.on('offer', (data) => {
          peerRef.current = data.from;
          peer.signal(data.data);
        });

        socket.on('answer', (data) => {
          peer.signal(data);
        });

        socket.on('ice-candidate', (candidate) => {
          peer.addIceCandidate(candidate);
        });
      })
      .catch((error) => console.error('Error accessing media devices:', error));
  }, []);

  const handleAnswer = () => {
    socket.emit('answer', { target: peerRef.current });
  };

  return (
    <div>
      <video ref={myVideo} autoPlay muted style={{ width: '200px' }}></video>
      <video ref={peerVideo} autoPlay style={{ width: '200px' }}></video>
      <audio ref={peerAudio} autoPlay></audio>
      <button onClick={handleAnswer}>Answer Call</button>
    </div>
  );
}

export default Video;
