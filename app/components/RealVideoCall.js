'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export default function RealVideoCall({ patientInfo, autoStart = false, onCallEnd }) {
  const [isJoined, setIsJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const joinInProgressRef = useRef(false);
  const channelNameRef = useRef('');
  const mountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(async () => {
    if (!mountedRef.current) return;
    
    console.log('🧹 Cleaning up video call...');
    
    try {
      // Leave channel if joined
      if (clientRef.current && isJoined) {
        await clientRef.current.leave();
        console.log('✅ Left channel');
      }
      
      // Close local tracks
      if (localVideoTrack) {
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }
      if (localAudioTrack) {
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }
      
      // Remove client
      if (clientRef.current) {
        clientRef.current.removeAllListeners();
        clientRef.current = null;
      }
      
      setIsJoined(false);
      setRemoteUsers([]);
      joinInProgressRef.current = false;
      
      if (onCallEnd) onCallEnd();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, [isJoined, localVideoTrack, localAudioTrack, onCallEnd]);

  // Initialize and join call
  const joinCall = useCallback(async () => {
    // Prevent multiple join attempts
    if (joinInProgressRef.current || isJoined || !mountedRef.current) {
      console.log('Join already in progress or already joined');
      return;
    }

    joinInProgressRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Check if App ID is configured
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
      if (!appId || appId === 'your_agora_app_id_here') {
        throw new Error('Agora App ID not configured. Please add it to your .env.local file');
      }

      // Generate a unique channel name
      const channelName = `consult_${Math.floor(Math.random() * 1000000)}`;
      channelNameRef.current = channelName;

      console.log('🔑 Using App ID:', appId);
      console.log('📺 Channel:', channelName);

      // Generate token (in production, get this from your backend)
      const token = null; // For testing with low security mode
      
      // Create client if it doesn't exist
      if (!clientRef.current) {
        clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        
        // Set up event listeners
        clientRef.current.on('user-published', handleUserPublished);
        clientRef.current.on('user-unpublished', handleUserUnpublished);
        clientRef.current.on('user-joined', handleUserJoined);
        clientRef.current.on('user-left', handleUserLeft);
      }

      // Join channel
      await clientRef.current.join(appId, channelName, token, null);
      console.log('✅ Joined channel successfully');

      // Create local tracks
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Play local video
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      // Publish local tracks
      await clientRef.current.publish([audioTrack, videoTrack]);
      console.log('📡 Published local tracks');

      setIsJoined(true);
      
    } catch (error) {
      console.error('❌ Failed to join call:', error);
      setError(error.message || 'Failed to join video call');
      
      // Cleanup on error
      await cleanup();
    } finally {
      joinInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [cleanup]);

  // Event handlers
  const handleUserPublished = useCallback(async (user, mediaType) => {
    console.log(`👤 User published: ${user.uid}, mediaType: ${mediaType}`);
    
    await clientRef.current.subscribe(user, mediaType);
    console.log(`✅ Subscribed to user ${user.uid}`);

    if (mediaType === 'video') {
      setRemoteUsers(prev => {
        if (!prev.find(u => u.uid === user.uid)) {
          return [...prev, user];
        }
        return prev;
      });

      // Play remote video after state update
      setTimeout(() => {
        const remoteVideoContainer = remoteVideoRefs.current[user.uid];
        if (remoteVideoContainer && user.videoTrack) {
          user.videoTrack.play(remoteVideoContainer);
        }
      }, 100);
    }

    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  }, []);

  const handleUserUnpublished = useCallback((user, mediaType) => {
    console.log(`👤 User unpublished: ${user.uid}, mediaType: ${mediaType}`);
    if (mediaType === 'video') {
      // Video track unpublished
    }
  }, []);

  const handleUserJoined = useCallback((user) => {
    console.log(`👤 User joined: ${user.uid}`);
  }, []);

  const handleUserLeft = useCallback((user) => {
    console.log(`👤 User left: ${user.uid}`);
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isJoined && !isLoading && !joinInProgressRef.current) {
      joinCall();
    }
  }, [autoStart, isJoined, isLoading, joinCall]);

  // Mount/unmount handling
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Start call handler
  const handleStartCall = () => {
    joinCall();
  };

  // End call handler
  const handleEndCall = async () => {
    await cleanup();
  };

  return (
    <div className="video-call-container">
      <div className="video-call-header">
        <h3>Video Consultation {patientInfo?.name && `- Dr. ${patientInfo.name}`}</h3>
        {!isJoined && !isLoading && !error && (
          <button 
            onClick={handleStartCall}
            className="start-call-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Joining...' : 'Start Video Call'}
          </button>
        )}
        {isJoined && (
          <button 
            onClick={handleEndCall}
            className="end-call-btn"
          >
            End Call
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Joining video call...</p>
        </div>
      )}

      <div className="video-grid">
        {/* Local video */}
        <div className="video-container local-video">
          <div ref={localVideoRef} className="video-player"></div>
          <div className="video-label">You {!isJoined && '(Preview)'}</div>
        </div>

        {/* Remote videos */}
        {remoteUsers.map(user => (
          <div key={user.uid} className="video-container remote-video">
            <div 
              ref={el => remoteVideoRefs.current[user.uid] = el} 
              className="video-player"
            ></div>
            <div className="video-label">Doctor</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .video-call-container {
          width: 100%;
          background: #f5f5f5;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .video-call-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .video-call-header h3 {
          color: #000000;
          margin: 0;
        }
        .start-call-btn, .end-call-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .start-call-btn {
          background: #2c5530;
          color: white;
        }
        .start-call-btn:hover:not(:disabled) {
          background: #1e3c22;
        }
        .start-call-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .end-call-btn {
          background: #dc3545;
          color: white;
        }
        .end-call-btn:hover {
          background: #c82333;
        }
        .error-message {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .error-message p {
          color: #721c24;
          margin: 0;
        }
        .error-message button {
          background: none;
          border: 1px solid #721c24;
          color: #721c24;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .loading-indicator {
          text-align: center;
          padding: 30px;
          background: white;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2c5530;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          min-height: 300px;
        }
        .video-container {
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 16/9;
        }
        .video-player {
          width: 100%;
          height: 100%;
          background: #1a1a1a;
        }
        .video-label {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}