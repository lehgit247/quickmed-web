'use client';
import { useState, useEffect, useCallback } from 'react';

export default function VideoCallUI({ onCallEnd }) {
  const [AgoraComponents, setAgoraComponents] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [channelName, setChannelName] = useState('');

  const initializeVideoCall = useCallback(async () => {
    try {
      // Generate a unique channel name
      const generatedChannel = `consult_${Date.now().toString().slice(-6)}`;
      setChannelName(generatedChannel);
      
      console.log('🚀 Patient starting video call on channel:', generatedChannel);
      
      // Dynamically import Agora components (client-side only)
      const agoraModule = await import('agora-rtc-react');
      console.log('✅ Agora components loaded');
      setAgoraComponents(agoraModule);

      // Get token from server
      const response = await fetch('/api/agora/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          channelName: generatedChannel, 
          uid: 'patient_' + Date.now().toString().slice(-6), 
          role: 'publisher' 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setTokenData(data);
    } catch (err) {
      console.error('❌ Video call initialization error:', err);
      setError(`Failed to start video call: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeVideoCall();
  }, [initializeVideoCall]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'black' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Initializing video consultation...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Please wait while we connect you with a doctor
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'black' }}>
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <h4>❌ Connection Error</h4>
          <p>{error}</p>
        </div>
        <button 
          onClick={onCallEnd}
          style={{ 
            padding: '10px 20px', 
            background: '#6c757d', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px'
          }}
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
      channelName={channelName}
    />
  );
}

function VideoCallComponent({ onCallEnd, AgoraComponents, tokenData, channelName }) {
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
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <h4>⚠️ Permission Required</h4>
          <p>Please allow camera and microphone permissions to start the video call.</p>
          <p style={{ fontSize: '14px' }}>Error: {camError?.message || micError?.message}</p>
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
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <div style={{ 
        color: 'black', 
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #e9ecef'
        }}>
          <div>
            <h2 style={{ margin: 0 }}>🎥 Video Consultation</h2>
            <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Channel: {channelName} • Status: {remoteUsers.length > 0 ? 'Connected to doctor' : 'Waiting for doctor'}
            </p>
          </div>
          <button 
            onClick={onCallEnd}
            style={{ 
              padding: '10px 25px', 
              background: '#dc3545', 
              color: 'white', 
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            End Call
          </button>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
            <h4 style={{ marginTop: 0, color: '#007bff' }}>Your Camera</h4>
            <div style={{ 
              width: '100%', 
              height: '300px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#e9ecef'
            }}>
              <LocalUser 
                audioTrack={localMicrophoneTrack} 
                videoTrack={localCameraTrack}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              This is what the doctor sees
            </p>
          </div>
          
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
            <h4 style={{ marginTop: 0, color: '#28a745' }}>Doctor&apos;s Camera</h4>
            {remoteUsers.map(user => (
              <div key={user.uid} style={{ 
                width: '100%', 
                height: '300px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#e9ecef'
              }}>
                <RemoteUser 
                  user={user}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ))}
            {remoteUsers.length === 0 && (
              <div style={{ 
                width: '100%', 
                height: '300px',
                borderRadius: '8px',
                border: '2px dashed #adb5bd',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#e9ecef',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍⚕️</div>
                <p style={{ fontSize: '16px', margin: 0 }}>Doctor will join shortly</p>
                <p style={{ fontSize: '14px', marginTop: '5px' }}>Please wait for the doctor to connect</p>
              </div>
            )}
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              {remoteUsers.length === 0 ? 'Doctor not connected yet' : 'Doctor is connected'}
            </p>
          </div>
        </div>
        
        <div style={{ 
          background: '#d1ecf1', 
          padding: '15px', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#0c5460'
        }}>
          <p style={{ margin: 0 }}>
            ℹ️ <strong>Note:</strong> Your video consultation is secure and private. 
            The doctor will join this call as soon as they are available.
          </p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AgoraRTCProvider>
  );
}