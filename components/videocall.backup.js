'use client';
import { useEffect, useState } from 'react';

export default function VideoCallBackup({
  consultationId = 'demo-room',
  autoStart = false,
  onCallEnd
}) {
  const [callState, setCallState] = useState('idle');

  const joinCall = async () => {
    setCallState('connecting');

    setTimeout(() => {
      setCallState('connected');
    }, 2000);
  };

  const leaveCall = () => {
    setCallState('ended');
    if (onCallEnd) onCallEnd();
  };

  useEffect(() => {
    if (autoStart && callState === 'idle') {
      joinCall();
    }
  }, [autoStart]);

  return (
    <div style={styles.container}>
      <h3>Video Consultation Backup</h3>
      <p>Room: {consultationId}</p>

      {callState === 'idle' && (
        <button onClick={joinCall} style={styles.startButton}>
          Start Call
        </button>
      )}

      {callState === 'connecting' && <p>Connecting...</p>}

      {callState === 'connected' && (
        <>
          <p>Connected</p>
          <button onClick={leaveCall} style={styles.endButton}>
            End Call
          </button>
        </>
      )}

      {callState === 'ended' && <p>Call ended.</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    borderRadius: '12px',
    background: '#f5f5f5'
  },
  startButton: {
    padding: '10px 20px',
    background: '#2c5530',
    color: '#fff',
    border: 'none',
    borderRadius: '6px'
  },
  endButton: {
    padding: '10px 20px',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px'
  }
};