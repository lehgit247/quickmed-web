'use client';
import { useState, useEffect } from 'react';

export default function VideoCallUI({ onCallEnd }) {
  const [AgoraComponents, setAgoraComponents] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeVideoCall = async () => {
      try {
        console.log('🚀 Initializing video call...');
        
        // Load Agora components
        const agoraModule = await import('agora-rtc-react');
        console.log('✅ Agora components loaded');
        setAgoraComponents(agoraModule);

        // Get token from server
        const channelName = 'consultation-' + Date.now();
        const response = await fetch('/api/agora/generate-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            channelName, 
            uid: Math.floor(Math.random() * 10000), 
            role: 'publisher' 
          })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setTokenData(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(`Failed to start video call: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeVideoCall();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'black' }}>
        <p>Initializing video call...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'black' }}>
        <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        <button 
          onClick={onCallEnd}
          style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none' }}
        >
          Close
        </button>
      </div>
    );
  }

  if (!AgoraComponents || !tokenData) {
    return (
      <div style={{ padding: '20px', color: 'black' }}>
        <p>Setting up video components...</p>
      </div>
    );
  }

  return (
    <VideoCallComponent 
      onCallEnd={onCallEnd} 
      AgoraComponents={AgoraComponents} 
      tokenData={tokenData} 
    />
  );
}

function VideoCallComponent({ onCallEnd, AgoraComponents, tokenData }) {
  const {
    useRTCClient,
    AgoraRTCProvider,
    LocalUser,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers
  } = AgoraComponents;

  const client = useRTCClient();
  const { localCameraTrack, error: camError } = useLocalCameraTrack();
  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();

  useJoin({
    appid: tokenData.appId,
    channel: tokenData.channelName,
    token: tokenData.token,
  });

  usePublish([localCameraTrack, localMicrophoneTrack]);

  if (camError || micError) {
    return (
      <div style={{ padding: '20px', color: 'black' }}>
        <p style={{ color: 'red', marginBottom: '10px' }}>
          Error accessing camera/microphone: {camError?.message || micError?.message}
        </p>
        <p>Please allow camera and microphone permissions in your browser.</p>
        <button 
          onClick={onCallEnd}
          style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none' }}
        >
          End Call
        </button>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <div style={{ color: 'black', border: '1px solid #ccc', padding: '20px', margin: '10px 0' }}>
        <h3>🎥 Video Consultation</h3>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div>
            <h4>Your Video</h4>
            <LocalUser 
              audioTrack={localMicrophoneTrack} 
              videoTrack={localCameraTrack} 
              style={{ 
                width: '300px', 
                height: '200px', 
                border: '2px solid #007bff',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            />
          </div>
          
          <div>
            <h4>Doctor's Video</h4>
            {remoteUsers.map(user => (
              <RemoteUser 
                key={user.uid} 
                user={user} 
                style={{ 
                  width: '300px', 
                  height: '200px', 
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }} 
              />
            ))}
            {remoteUsers.length === 0 && (
              <div style={{ 
                width: '300px', 
                height: '200px', 
                border: '2px dashed #ccc',
                borderRadius: '8px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#f8f9fa',
                color: '#666'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p>👨‍⚕️ Waiting for doctor to join...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={onCallEnd}
          style={{ 
            padding: '10px 20px', 
            background: '#dc3545', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px'
          }}
        >
          End Call
        </button>
      </div>
    </AgoraRTCProvider>
  );
}