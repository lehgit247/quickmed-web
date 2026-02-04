// components/VideoCall.js
'use client';
import React, { useEffect, useRef, useState } from 'react';

const VideoCall = ({ consultationId, user, onCallEnd }) => {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agoraRTC, setAgoraRTC] = useState(null);
  const [error, setError] = useState(null);

  const localPlayerRef = useRef(null);
  const remotePlayerRef = useRef(null);

  useEffect(() => {
    const loadAgoraRTC = async () => {
      try {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        setAgoraRTC(AgoraRTC);
        
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);

        agoraClient.on('user-published', async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        agoraClient.on('user-unpublished', (user) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });
      } catch (error) {
        console.error('Failed to load AgoraRTC:', error);
      }
    };

    loadAgoraRTC();
  }, []);

  const joinChannel = async () => {
    if (!client || !consultationId || !agoraRTC) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agora/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName: consultationId,
          uid: user.id,
          role: 'publisher'
        }),
      });

      if (!response.ok) throw new Error('Failed to get token');
      const { token, appId } = await response.json();

      await client.join(appId, consultationId, token, user.id);
      const audioTrack = await agoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await agoraRTC.createCameraVideoTrack();
      await client.publish([audioTrack, videoTrack]);

      if (localPlayerRef.current) videoTrack.play(localPlayerRef.current);
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      setIsJoined(true);
      
    } catch (error) {
      console.error('Failed to join channel:', error);
      setError('Failed to join video call');
    } finally {
      setIsLoading(false);
    }
  };

  const leaveChannel = async () => {
    if (!client) return;
    try {
      localAudioTrack?.close();
      localVideoTrack?.close();
      await client.leave();
      setIsJoined(false);
      setRemoteUsers([]);
      if (onCallEnd) onCallEnd();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const toggleAudio = async () => {
    if (!localAudioTrack) return;
    try {
      await localAudioTrack.setEnabled(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    } catch (error) {
      console.error('Failed to toggle audio:', error);
    }
  };

  const toggleVideo = async () => {
    if (!localVideoTrack) return;
    try {
      await localVideoTrack.setEnabled(isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  if (!agoraRTC) return <div>Loading video system...</div>;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', margin: '16px 0', backgroundColor: 'white' }}>
      <h3 style={{ color: 'black' }}>Video Consultation</h3>
      
      {error && <div style={{ background: '#fee', color: '#721c24', padding: '12px', borderRadius: '5px', marginBottom: '16px' }}>{error}</div>}
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ color: 'black', fontWeight: 'bold', marginBottom: '8px' }}>You ({user.name})</div>
          <div ref={localPlayerRef} style={{ width: '100%', height: '250px', backgroundColor: '#000', borderRadius: '8px' }} />
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ color: 'black', fontWeight: 'bold', marginBottom: '8px' }}>
            {remoteUsers.length > 0 ? 'Remote Participant' : 'Waiting for participant...'}
          </div>
          <div ref={remotePlayerRef} style={{ width: '100%', height: '250px', backgroundColor: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            {remoteUsers.length === 0 && 'No video feed yet'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {!isJoined ? (
          <button onClick={joinChannel} disabled={isLoading} style={{ padding: '12px 24px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
            {isLoading ? 'Connecting...' : '🎥 Join Video Call'}
          </button>
        ) : (
          <>
            <button onClick={toggleAudio} style={{ padding: '12px 16px', backgroundColor: isAudioMuted ? '#ff4d4f' : '#f0f0f0', color: isAudioMuted ? 'white' : 'black', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {isAudioMuted ? '🔇 Unmute' : '🎤 Mute'}
            </button>
            <button onClick={toggleVideo} style={{ padding: '12px 16px', backgroundColor: isVideoMuted ? '#ff4d4f' : '#f0f0f0', color: isVideoMuted ? 'white' : 'black', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {isVideoMuted ? '📹 Start Video' : '📹 Stop Video'}
            </button>
            <button onClick={leaveChannel} style={{ padding: '12px 16px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              📞 End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;