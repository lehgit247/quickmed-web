'use client';
import { useState, useEffect, useRef } from 'react';

export default function DoctorVideoCall({ onCallEnd = () => {}, channelName = 'consultation-room' }) {
  const [agoraEngine, setAgoraEngine] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientJoined, setPatientJoined] = useState(false);
  
  const localPlayerRef = useRef(null);
  const remotePlayerRef = useRef(null);

  // Use SAME App ID as patient side
  const AGORA_APP_ID = '8f04fd597fc04f18841f26ed5a33dc66'; 

  useEffect(() => {
    initializeAgora();
    
    return () => {
      cleanup();
    };
  }, [channelName]);

const cleanup = async () => {
  console.log('🧹 Cleaning up patient media tracks...');
  
  try {
    // Stop and close all local tracks
    localTracks.forEach(track => {
      if (track) {
        track.stop();
        track.close();
      }
    });
    
    // Leave channel
    if (agoraEngine) {
      console.log('Leaving Agora channel...');
      await agoraEngine.leave();
      console.log('✅ Patient left channel');
    }
    
    setLocalTracks([]);
    setIsJoined(false);
    setPatientJoined(false);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
};

  const initializeAgora = async () => {
    try {
      setIsLoading(true);
      console.log('👨‍⚕️ Doctor initializing Agora RTC...');

      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      
      const engine = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setAgoraEngine(engine);

      // For APP ID authentication (no token needed)
      const uid = Math.floor(Math.random() * 10000) + 10000; // Doctor UID
      
      console.log('🔗 Doctor joining channel...');
      console.log('✅ Doctor joined. Waiting for patient...');
      console.log('App ID:', AGORA_APP_ID);
      console.log('Channel:', channelName);
      console.log('UID:', uid);

      await engine.join(
        AGORA_APP_ID,
        channelName,
        null, // Token can be null with APP ID auth
        uid
      );
      
      console.log('✅ Doctor joined channel successfully');
      setIsJoined(true);

      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      // Store tracks for cleanup
      setLocalTracks([localAudioTrack, localVideoTrack]);

      await engine.publish([localAudioTrack, localVideoTrack]);
      console.log('✅ Doctor tracks published');

      if (localPlayerRef.current) {
        localVideoTrack.play(localPlayerRef.current);
      }

      // Event listeners
      engine.on('user-published', async (user, mediaType) => {
        await engine.subscribe(user, mediaType);
        console.log('✅ Patient subscribed:', user.uid);
        
        setPatientJoined(true);

        if (mediaType === 'video' && remotePlayerRef.current) {
          user.videoTrack.play(remotePlayerRef.current);
        }
        
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      engine.on('user-left', (user) => {
        console.log('🔴 Patient left the channel:', user.uid);
        setPatientJoined(false);
      });

      setIsLoading(false);

    } catch (err) {
      console.error('❌ Doctor Agora initialization failed:', err);
      setError(`Doctor video call failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleEndCall = async () => {
  console.log('🔄 Ending patient consultation...');
  
  try {
    await cleanup();
    console.log('✅ Cleanup completed');
    onCallEnd(); // Call the callback
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    onCallEnd(); // Still call the callback
  }
};

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'black' }}>
        <p>👨‍⚕️ Joining patient call...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Please allow camera & microphone permissions</p>
        <p style={{ fontSize: '12px', color: '#888' }}>Channel: {channelName}</p>
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
      <h3>👨‍⚕️ Doctor Video Consultation</h3>
      <p style={{ color: '#28a745', fontSize: '14px', marginBottom: '20px' }}>
        ✅ Connected to Video Service
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
          <h4>Patient's Video</h4>
          <div 
            ref={remotePlayerRef}
            style={{ 
              width: '300px', 
              height: '200px', 
              border: patientJoined ? '2px solid #28a745' : '2px dashed #ccc',
              borderRadius: '8px',
              backgroundColor: patientJoined ? '#000' : '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: patientJoined ? 'white' : '#666'
            }}
          >
            {patientJoined ? (
              <p>Patient connected! 🎥</p>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '16px', marginBottom: '10px' }}>👤</p>
                <p>Waiting for patient...</p>
                <p style={{ fontSize: '12px', marginTop: '5px' }}>Patient will appear here automatically</p>
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
          📞 End Consultation
        </button>
        
        <div style={{ color: '#666', fontSize: '14px' }}>
          Status: {isJoined ? '✅ Connected to Channel' : '🔄 Connecting...'} | 
          Patient: {patientJoined ? '🟢 Connected' : '🟡 Waiting...'}
        </div>
        
        <div style={{ color: '#888', fontSize: '12px' }}>
          Channel: {channelName}
        </div>
      </div>
    </div>
  );
}