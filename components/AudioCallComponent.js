'use client';
import { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export default function AudioCallComponent({ patientInfo, doctorInfo, onEndCall }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  
  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const channelName = useRef(`audio_${Math.floor(Math.random() * 1000000)}`);

  const joinCall = async () => {
    if (isLoading || isJoined) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
      
      if (!appId || appId === 'your_actual_agora_app_id_here') {
        throw new Error('Agora App ID not configured');
      }

      console.log('🔑 Audio call - Using App ID:', appId);
      console.log('📞 Audio channel:', channelName.current);

      // Create Agora client (audio only)
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      // Handle remote users
      clientRef.current.on('user-published', async (user, mediaType) => {
        await clientRef.current.subscribe(user, mediaType);
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      // Join channel
      await clientRef.current.join(appId, channelName.current, null, null);
      console.log('✅ Joined audio channel successfully');
      
      // Create local audio track only (no video)
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = audioTrack;
      
      // Publish audio track
      await clientRef.current.publish([audioTrack]);
      console.log('📡 Published audio track');
      
      setIsJoined(true);
      
    } catch (error) {
      console.error('❌ Failed to join audio call:', error);
      setError(error.message || 'Failed to join audio call');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const leaveCall = async () => {
    try {
      if (clientRef.current && isJoined) {
        await clientRef.current.leave();
        console.log('👋 Left audio channel');
      }
      
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
      }
      
      setIsJoined(false);
      if (onEndCall) onEndCall();
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
      }
      if (clientRef.current && isJoined) {
        clientRef.current.leave();
      }
    };
  }, [isJoined]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>📞 Audio Consultation</h3>
          <p style={styles.subtitle}>with Dr. {doctorInfo?.name || 'Smith'}</p>
        </div>
        {!isJoined && !isLoading && !error && (
          <button onClick={joinCall} style={styles.startButton}>
            Start Audio Call
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
          <p>Connecting to doctor...</p>
        </div>
      )}

      {isJoined && (
        <div style={styles.callStatus}>
          <div style={styles.statusIcon}>📞</div>
          <p style={styles.statusText}>Connected to Dr. {doctorInfo?.name || 'Smith'}</p>
          <div style={styles.controls}>
            <button onClick={toggleMute} style={styles.controlButton}>
              {isMuted ? '🔇 Unmute' : '🎤 Mute'}
            </button>
          </div>
          <p style={styles.timer}>Call in progress...</p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
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
    fontSize: '18px',
  },
  subtitle: {
    color: '#666',
    margin: '5px 0 0 0',
    fontSize: '12px',
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
  callStatus: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '8px',
  },
  statusIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: '20px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  controlButton: {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  timer: {
    color: '#666',
    fontSize: '12px',
  },
};