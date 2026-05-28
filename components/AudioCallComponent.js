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

export default function AudioCallComponent({
  patientInfo,
  doctorInfo,
  consultationId,
  channelName,
  onEndCall,
  autoStart = false,
  registerPatient = true
}) {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [activeChannel, setActiveChannel] = useState(
    safeChannelName(channelName || consultationId)
  );
  const [remoteUsers, setRemoteUsers] = useState(0);

  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const consultationIdRef = useRef(consultationId || null);
  const hasAutoStartedRef = useRef(false);

  const cleanup = useCallback(async () => {
    try {
      localAudioTrackRef.current?.stop();
      localAudioTrackRef.current?.close();
      localAudioTrackRef.current = null;

      if (clientRef.current) {
        clientRef.current.removeAllListeners();
        await clientRef.current.leave();
        clientRef.current = null;
      }

      setRemoteUsers(0);
    } catch (err) {
      console.error('Error cleaning up audio call:', err);
    }
  }, []);

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
        consultationType: 'call',
        patientInfo: {
          name: patientInfo?.name || 'Patient',
          symptoms: patientInfo?.symptoms || 'Audio consultation requested'
        }
      })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Could not create an audio room.');
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
      throw new Error(result.error || 'Could not prepare the audio service.');
    }

    return result;
  };

  const joinCall = useCallback(async () => {
    if (isLoading || isJoined) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access is not available in this browser.');
      }

      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop());

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

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        setRemoteUsers(client.remoteUsers.length);

        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
        }
      });

      client.on('user-unpublished', () => setRemoteUsers(client.remoteUsers.length));
      client.on('user-left', () => setRemoteUsers(client.remoteUsers.length));

      await client.join(appId, roomName, token || null, uid);

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = audioTrack;

      await client.publish([audioTrack]);

      setActiveChannel(roomName);
      setRemoteUsers(client.remoteUsers.length);
      setIsJoined(true);
    } catch (err) {
      console.error('Failed to join audio call:', err);
      await cleanup();
      setError(err.message || 'Failed to join audio call.');
    } finally {
      setIsLoading(false);
    }
  }, [activeChannel, cleanup, consultationId, isJoined, isLoading, registerConsultation]);

  const toggleMute = async () => {
    if (!localAudioTrackRef.current) return;
    await localAudioTrackRef.current.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

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

    setIsJoined(false);
    onEndCall?.();
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Audio Consultation</h3>
          <p style={styles.subtitle}>
            with Dr. {doctorInfo?.name || 'Available Doctor'}
            {activeChannel ? ` • Room: ${activeChannel}` : ''}
          </p>
        </div>

        {!isJoined && !isLoading ? (
          <button onClick={joinCall} style={styles.startButton}>
            Start Audio Call
          </button>
        ) : null}

        {isJoined ? (
          <button onClick={leaveCall} style={styles.endButton}>
            End Call
          </button>
        ) : null}
      </div>

      {error ? (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError(null)} style={styles.dismissButton}>
            Try Again
          </button>
        </div>
      ) : null}

      {isLoading && !isJoined ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Connecting to doctor...</p>
        </div>
      ) : null}

      {isJoined ? (
        <div style={styles.callStatus}>
          <div style={styles.statusIcon}>Call active</div>
          <p style={styles.statusText}>
            {remoteUsers ? `Connected to Dr. ${doctorInfo?.name || 'Available Doctor'}` : 'Waiting for doctor to join...'}
          </p>
          <div style={styles.controls}>
            <button onClick={toggleMute} style={styles.controlButton}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
          <p style={styles.timer}>Audio consultation in progress</p>
        </div>
      ) : null}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px'
  },
  title: {
    color: '#000000',
    margin: 0,
    fontSize: '18px'
  },
  subtitle: {
    color: '#666',
    margin: '5px 0 0 0',
    fontSize: '12px'
  },
  startButton: {
    padding: '10px 20px',
    background: '#2c5530',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  endButton: {
    padding: '10px 20px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
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
    color: '#721c24'
  },
  dismissButton: {
    background: 'none',
    border: '1px solid #721c24',
    color: '#721c24',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '8px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2c5530',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 10px'
  },
  callStatus: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '8px'
  },
  statusIcon: {
    fontSize: '22px',
    marginBottom: '20px',
    fontWeight: 700
  },
  statusText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: '20px'
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px'
  },
  controlButton: {
    padding: '10px 20px',
    background: '#2457a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  timer: {
    color: '#666',
    fontSize: '12px'
  }
};
