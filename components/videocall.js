'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

function createUid() {
  return Math.floor(Math.random() * 1000000) + 1;
}

function safeChannelName(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_!#$%&()+\-:;<=.>?@[\]^{}|~, ]/g, '_')
    .slice(0, 60);
}

export default function VideoCall({
  consultationId,
  channelName,
  patientInfo,
  autoStart = false,
  onCallEnd,
  registerPatient = true
}) {
  const [callState, setCallState] = useState('idle');
  const [error, setError] = useState(null);
  const [activeChannel, setActiveChannel] = useState(
    safeChannelName(channelName || consultationId)
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState(0);

  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const consultationIdRef = useRef(consultationId || null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const hasAutoStartedRef = useRef(false);

  const cleanup = useCallback(async () => {
    try {
      localAudioTrackRef.current?.stop();
      localAudioTrackRef.current?.close();
      localAudioTrackRef.current = null;

      localVideoTrackRef.current?.stop();
      localVideoTrackRef.current?.close();
      localVideoTrackRef.current = null;

      if (clientRef.current) {
        clientRef.current.removeAllListeners();
        await clientRef.current.leave();
        clientRef.current = null;
      }

      setRemoteUsers(0);
    } catch (err) {
      console.error('Error cleaning up video call:', err);
    }
  }, []);

  const checkPermissions = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera and microphone access is not available in this browser.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    stream.getTracks().forEach((track) => track.stop());
  };

  const registerConsultation = useCallback(async () => {
    if (!registerPatient || activeChannel) {
      return {
        consultationId: consultationIdRef.current,
        channelName: activeChannel || safeChannelName(channelName || consultationId)
      };
    }

    const response = await fetch('/api/consultation/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'patient_request',
        consultationType: 'video',
        patientInfo: {
          name: patientInfo?.name || 'Patient',
          symptoms: patientInfo?.symptoms || 'Video consultation requested'
        }
      })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Could not create a consultation room.');
    }

    consultationIdRef.current = result.consultationId;
    setActiveChannel(result.channelName);

    return result;
  }, [activeChannel, channelName, consultationId, patientInfo, registerPatient]);

  const getAgoraCredentials = async (roomName, uid) => {
    const response = await fetch('/api/agora/generate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelName: roomName,
        uid,
        role: 'publisher'
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Could not prepare the video service.');
    }

    return result;
  };

  const joinCall = useCallback(async () => {
    if (callState === 'connecting' || callState === 'connected' || callState === 'waiting_for_doctor') {
      return;
    }

    setCallState('requesting_permissions');
    setError(null);

    try {
      await checkPermissions();
      setCallState('connecting');

      const room = await registerConsultation();
      const roomName = safeChannelName(room.channelName || activeChannel || consultationId);

      if (!roomName) {
        throw new Error('Missing consultation room name.');
      }

      const uid = createUid();
      const { appId, token } = await getAgoraCredentials(roomName, uid);

      if (!appId) {
        throw new Error('Agora App ID is not configured.');
      }

      const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8'
      });

      clientRef.current = client;

      client.on('connection-state-change', (curState) => {
        if (curState === 'RECONNECTING') setCallState('reconnecting');
        if (curState === 'CONNECTED') setCallState('connected');
        if (curState === 'DISCONNECTED') setCallState('ended');
      });

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        setRemoteUsers(client.remoteUsers.length);

        if (mediaType === 'video' && user.videoTrack && remoteVideoRef.current) {
          user.videoTrack.play(remoteVideoRef.current);
        }

        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
        }
      });

      client.on('user-unpublished', () => {
        setRemoteUsers(client.remoteUsers.length);
      });

      client.on('user-left', () => {
        setRemoteUsers(client.remoteUsers.length);
      });

      await client.join(appId, roomName, token || null, uid);

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      await client.publish([audioTrack, videoTrack]);

      setActiveChannel(roomName);
      setCallState(client.remoteUsers.length ? 'connected' : 'waiting_for_doctor');
      setRemoteUsers(client.remoteUsers.length);
    } catch (err) {
      console.error('Failed to join video call:', err);
      await cleanup();
      setError(err.message || 'Failed to join video call.');
      setCallState('failed');
    }
  }, [activeChannel, callState, cleanup, consultationId, registerConsultation]);

  const leaveCall = async () => {
    await cleanup();

    if (consultationIdRef.current) {
      fetch('/api/consultation/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'end_consultation',
          consultationId: consultationIdRef.current
        })
      }).catch((err) => console.error('Could not end consultation:', err));
    }

    setCallState('ended');
    onCallEnd?.();
  };

  const toggleMute = async () => {
    if (!localAudioTrackRef.current) return;
    await localAudioTrackRef.current.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const toggleCamera = async () => {
    if (!localVideoTrackRef.current) return;
    await localVideoTrackRef.current.setEnabled(isCameraOff);
    setIsCameraOff(!isCameraOff);
  };

  useEffect(() => {
    if (autoStart && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      joinCall();
    }
  }, [autoStart, joinCall]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const isInCall = ['connected', 'waiting_for_doctor', 'reconnecting'].includes(callState);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>QuickMed Video Consultation</h3>
          <p style={styles.subtitle}>
            {activeChannel ? `Room: ${activeChannel}` : 'Ready to create a secure room'}
          </p>
        </div>

        {callState === 'idle' || callState === 'failed' || callState === 'ended' ? (
          <button onClick={joinCall} style={styles.startButton}>
            Start Video Call
          </button>
        ) : null}

        {isInCall ? (
          <button onClick={leaveCall} style={styles.endButton}>
            End Call
          </button>
        ) : null}
      </div>

      {error ? <div style={styles.error}>{error}</div> : null}

      <p style={styles.status}>
        Status: {callState.replaceAll('_', ' ')}
        {isInCall ? ` • ${remoteUsers ? 'Doctor connected' : 'Waiting for doctor'}` : ''}
      </p>

      <div style={styles.videoGrid}>
        <div style={styles.videoTile}>
          <div ref={localVideoRef} style={styles.video} />
          <span style={styles.videoLabel}>You</span>
        </div>
        <div style={styles.videoTile}>
          <div ref={remoteVideoRef} style={styles.video} />
          {!remoteUsers ? <span style={styles.placeholder}>Waiting for doctor...</span> : null}
          <span style={styles.videoLabel}>Doctor</span>
        </div>
      </div>

      {isInCall ? (
        <div style={styles.controls}>
          <button onClick={toggleMute} style={styles.controlButton}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={toggleCamera} style={styles.controlButton}>
            {isCameraOff ? 'Camera On' : 'Camera Off'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '12px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    color: '#1f3d24'
  },
  subtitle: {
    margin: '6px 0 0',
    color: '#666',
    fontSize: '13px'
  },
  startButton: {
    background: '#2c5530',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 700
  },
  endButton: {
    background: '#dc3545',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 700
  },
  controlButton: {
    background: '#2457a6',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 700
  },
  error: {
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '6px',
    color: '#721c24',
    marginBottom: '15px',
    padding: '12px'
  },
  status: {
    color: '#333',
    textTransform: 'capitalize'
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px'
  },
  videoTile: {
    position: 'relative',
    minHeight: '300px',
    background: '#000',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    height: '300px',
    background: '#000'
  },
  videoLabel: {
    position: 'absolute',
    left: '12px',
    bottom: '12px',
    background: 'rgba(0,0,0,0.65)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  placeholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700
  },
  controls: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '16px'
  }
};
