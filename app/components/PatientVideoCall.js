'use client';
import { useState, useEffect } from 'react';
import { useRTCClient, AgoraRTCProvider, LocalUser, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from "agora-rtc-react";

export default function PatientVideoCall() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading video call...</div>;
  }

  return (
    <div style={{ color: 'black' }}>
      <h3>Video Consultation</h3>
      <VideoCallInterface />
    </div>
  );
}

function VideoCallInterface() {
  const [isCallActive, setIsCallActive] = useState(false);
  const client = useRTCClient();

  return (
    <AgoraRTCProvider client={client}>
      {!isCallActive ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px 0' }}>
          <p>Ready to start video consultation</p>
          <button 
            onClick={() => setIsCallActive(true)}
            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}
          >
            Start Video Call
          </button>
        </div>
      ) : (
        <VideoCallRoom onCallEnd={() => setIsCallActive(false)} />
      )}
    </AgoraRTCProvider>
  );
}

function VideoCallRoom({ onCallEnd }) {
  const appId = 'YOUR_APP_ID'; // Replace with your App ID
  const token = 'YOUR_TOKEN'; // Replace with your token
  const channel = 'consultation-room-1';

  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();

  useJoin({
    appid: appId,
    channel: channel,
    token: token,
  });

  usePublish([localCameraTrack, localMicrophoneTrack]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4>Your Video</h4>
          <LocalUser 
            audioTrack={localMicrophoneTrack} 
            videoTrack={localCameraTrack} 
            style={{ width: '300px', height: '200px' }}
          />
        </div>
        <div>
          <h4>Doctor</h4>
          {remoteUsers.map(user => (
            <RemoteUser key={user.uid} user={user} style={{ width: '300px', height: '200px' }} />
          ))}
          {remoteUsers.length === 0 && (
            <div style={{ width: '300px', height: '200px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Doctor will join soon...</p>
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={onCallEnd}
        style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none' }}
      >
        End Call
      </button>
    </div>
  );
}