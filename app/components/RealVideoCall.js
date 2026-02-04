'use client';
import { useState, useEffect, useRef } from 'react';

export default function RealVideoCall({ onCallEnd = () => {}, patientInfo = {}, autoStart = false }) {
  const [agoraEngine, setAgoraEngine] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [channelName, setChannelName] = useState('');
  const [doctorJoined, setDoctorJoined] = useState(false);
  
  const localPlayerRef = useRef(null);
  const remotePlayerRef = useRef(null);

  // HARDCODE YOUR AGORA APP ID FOR NOW
  const AGORA_APP_ID = '8f04fd597fc04f18841f26ed5a33dc66';

  useEffect(() => {
    initializeAgora();
    
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = async () => {
    console.log('🧹 Cleaning up patient media tracks...');
    
    // Stop and close all local tracks
    localTracks.forEach(track => {
      if (track) {
        track.stop();
        track.close();
      }
    });
    
    // Leave channel
    if (agoraEngine) {
      await agoraEngine.leave();
      console.log('✅ Patient left channel');
    }
    
    setLocalTracks([]);
  };

const requestConsultation = async () => {
  // Use fixed channel for testing
  const channelName = 'test_quickmed_channel';
  
  console.log('🚀 Starting video consultation. Channel:', channelName);
  return {
    success: true,
    channelName: channelName,
    token: null
  };
};

  const initializeAgora = async () => {
    try {
      setIsLoading(true);
      
      // Request consultation
      const consultationData = await requestConsultation();
      
      if (!consultationData.success) {
        throw new Error(consultationData.error || 'Failed to request consultation');
      }

      console.log('✅ Consultation requested. Channel:', consultationData.channelName);
      console.log('🔑 Using App ID:', AGORA_APP_ID);
      setChannelName(consultationData.channelName);

      // Initialize Agora with the channel
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      
      const engine = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setAgoraEngine(engine);

      // Setup event listeners BEFORE joining
      engine.on('user-published', async (user, mediaType) => {
        console.log('🟢 Doctor published stream:', user.uid, mediaType);
        await engine.subscribe(user, mediaType);
        console.log('✅ Subscribed to doctor:', user.uid);

        if (mediaType === 'video' && remotePlayerRef.current) {
          user.videoTrack.play(remotePlayerRef.current);
          setDoctorJoined(true);
          console.log('🎥 Doctor video is now playing');
        }
        
        if (mediaType === 'audio') {
          user.audioTrack.play();
          console.log('🔊 Doctor audio is now playing');
        }
      });

      engine.on('user-joined', (user) => {
        console.log('🟢 Doctor joined the channel:', user.uid);
        setDoctorJoined(true);
      });

      engine.on('user-left', (user) => {
        console.log('🔴 Doctor left the channel:', user.uid);
        setDoctorJoined(false);
      });

      // Join the channel with TEMPORARY TOKEN (null for testing)
      const uid = Math.floor(Math.random() * 10000);
      
      console.log('🔗 Joining channel...');
      console.log('✅ Patient joined. Waiting for doctor...');
      console.log('App ID:', AGORA_APP_ID);
      console.log('Channel:', consultationData.channelName);
      console.log('UID:', uid);
      
     await engine.join(
  AGORA_APP_ID,
  consultationData.channelName,
  null, // Token can be null with APP ID auth
  uid
);
      
      console.log('✅ Patient joined channel successfully:', consultationData.channelName);
      setIsJoined(true);

      // Create and publish local tracks
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      // Store tracks for cleanup
      setLocalTracks([localAudioTrack, localVideoTrack]);

      await engine.publish([localAudioTrack, localVideoTrack]);
      console.log('✅ Patient tracks published');

      // Setup local video element
      if (localPlayerRef.current) {
        localVideoTrack.play(localPlayerRef.current);
      }

      setIsLoading(false);

    } catch (err) {
      console.error('❌ Agora initialization failed:', err);
      setError(`Video call failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleEndCall = async () => {
  console.log('🔄 Manually ending call...');
  
  // Immediately call the callback
  onCallEnd();
  
  // Show immediate feedback
  alert('Call ended!');
  
  // Try cleanup in background
  try {
    await cleanup();
  } catch (e) {
    console.log('Background cleanup failed:', e);
  }
};

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'black' }}>
        <p>{autoStart ? '🚀 Starting paid consultation...' : '🔄 Requesting video consultation...'}</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Setting up your camera and microphone</p>
        <p style={{ fontSize: '12px', color: '#888' }}>Channel: {channelName || 'Creating...'}</p>
        {autoStart && (
          <p style={{ fontSize: '12px', color: '#28a745', marginTop: '5px' }}>
            ⚡ Premium: No waiting time
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'black' }}>
        <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        <button 
          onClick={handleEndCall}
          style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none' }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div style={{ color: 'black', border: '1px solid #ccc', padding: '20px', margin: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3>🎥 Video Consultation {doctorJoined ? '- Connected! 🟢' : '- Waiting for Doctor 🟡'}</h3>
        {autoStart && (
          <span style={{ 
            background: '#28a745', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            PREMIUM
          </span>
        )}
      </div>
      
      <p style={{ color: doctorJoined ? '#28a745' : '#ffa500', fontSize: '14px', marginBottom: '20px' }}>
        {autoStart ? 
          (doctorJoined ? '✅ Doctor is in the call!' : '⏳ Connecting to doctor...') :
          (doctorJoined ? '✅ Doctor is in the call!' : '⏳ Doctor has been notified and will join shortly...')
        }
      </p>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <h4>Your Video</h4>
          <div 
            ref={localPlayerRef}
            style={{ 
              width: '300px', 
              height: '200px', 
              border: '2px solid #007bff',
              borderRadius: '8px',
              backgroundColor: '#000'
            }}
          ></div>
        </div>
        
        <div>
          <h4>Doctor's Video</h4>
          <div 
            ref={remotePlayerRef}
            style={{ 
              width: '300px', 
              height: '200px', 
              border: doctorJoined ? '2px solid #28a745' : '2px dashed #ffa500',
              borderRadius: '8px',
              backgroundColor: doctorJoined ? '#000' : '#fff9e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: doctorJoined ? 'white' : '#666'
            }}
          >
            {doctorJoined ? (
              <p>Doctor is connected! 🎥</p>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '16px', marginBottom: '10px' }}>👨‍⚕️</p>
                <p>{autoStart ? 'Connecting...' : 'Waiting for doctor to join...'}</p>
                <p style={{ fontSize: '12px', marginTop: '5px' }}>
                  {autoStart ? 'Premium connection in progress' : 'They will appear here automatically'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={handleEndCall}
          style={{ 
            padding: '10px 20px', 
            background: '#dc3545', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📞 End Call
        </button>
        
        <div style={{ color: '#666', fontSize: '14px' }}>
          Status: {doctorJoined ? '🟢 Connected to Doctor' : '🟡 Waiting for doctor...'}
        </div>
        
        {channelName && (
          <div style={{ color: '#888', fontSize: '12px' }}>
            Channel: {channelName}
          </div>
        )}
        
        {autoStart && !doctorJoined && (
          <div style={{ color: '#28a745', fontSize: '12px', fontWeight: 'bold' }}>
            ⚡ Premium connection active
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>Debug: {isJoined ? 'Joined' : 'Not joined'} | Doctor: {doctorJoined ? 'Connected' : 'Not connected'} | Mode: {autoStart ? 'Premium (Auto-start)' : 'Standard'}</p>
      </div>
    </div>
  );
}