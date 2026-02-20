'use client';
import { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export default function VideoCallComponent({ patientInfo, autoStart = false, onCallEnd }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const channelName = useRef(`consult_${Math.floor(Math.random() * 1000000)}`);

  const joinCall = async () => {
    if (isLoading || isJoined) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
      
      if (!appId || appId === 'your_agora_app_id_here') {
        throw new Error('Agora App ID not configured');
      }

      // Create client
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      // Handle remote users
      clientRef.current.on('user-published', async (user, mediaType) => {
        await clientRef.current.subscribe(user, mediaType);
        if (mediaType === 'video') {
          const remoteVideo = document.getElementById('remote-video');
          if (remoteVideo) user.videoTrack.play(remoteVideo);
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      // Join channel
      await clientRef.current.join(appId, channelName.current, null, null);
      
      // Create local tracks
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      // Play local video
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }
      
      // Publish tracks
      await clientRef.current.publish([audioTrack, videoTrack]);
      
      setIsJoined(true);
      
    } catch (error) {
      console.error('Failed to join call:', error);
      setError(error.message || 'Failed to join video call');
    } finally {
      setIsLoading(false);
    }
  };

  const leaveCall = async () => {
    if (clientRef.current && isJoined) {
      await clientRef.current.leave();
      setIsJoined(false);
      if (onCallEnd) onCallEnd();
    }
  };

  useEffect(() => {
    if (autoStart && !isJoined && !isLoading) {
      joinCall();
    }
  }, [autoStart]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Video Consultation</h3>
        {!isJoined && !isLoading && !error && (
          <button onClick={joinCall} style={styles.startButton}>
            Start Video Call
          </button>
        )}
        {isJoined && (
          <button onClick={leaveCall} style={styles.endButton}>
            End Call
          </button>
        )}
      </div>

      {error && (
        <div style={styles.error}>
          <p>❌ {error}</p>
          <button onClick={() => setError(null)} style={styles.dismissButton}>
            Try Again
          </button>
        </div>
      )}

      {isLoading && !isJoined && (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Setting up camera and microphone...</p>
        </div>
      )}

      <div style={styles.videoGrid}>
        <div style={styles.videoContainer}>
          <div ref={localVideoRef} style={styles.videoPlayer}></div>
          <div style={styles.videoLabel}>You</div>
        </div>
        <div style={styles.videoContainer}>
          <div id="remote-video" style={styles.videoPlayer}></div>
          <div style={styles.videoLabel}>Doctor</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    background: '#f5f5f5',
    borderRadius: '12px',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#000000',
    margin: 0,
  },
  startButton: {
    padding: '10px 20px',
    background: '#2c5530',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  endButton: {
    padding: '10px 20px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  error: {
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dismissButton: {
    background: 'none',
    border: '1px solid #721c24',
    color: '#721c24',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2c5530',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 10px',
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    minHeight: '300px',
  },
  videoContainer: {
    position: 'relative',
    background: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    aspectRatio: '16/9',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    background: '#1a1a1a',
  },
  videoLabel: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
};

// Add global style
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}