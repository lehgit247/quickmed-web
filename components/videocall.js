'use client';
import { useEffect, useRef, useState } from 'react';

export default function VideoCall({ patientInfo, autoStart = false, onCallEnd }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsJoined(true);
      setIsLoading(false);
      alert('Video call started (demo mode)');
    }, 2000);
  };

  const leaveCall = () => {
    setIsJoined(false);
    if (onCallEnd) onCallEnd();
    alert('Video call ended');
  };

  useEffect(() => {
    if (autoStart && !isJoined && !isLoading) {
      joinCall();
    }
  }, [autoStart]);

  return (
    <div style={{
      width: '100%',
      background: '#f5f5f5',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h3 style={{ color: '#000000', margin: 0 }}>Video Consultation</h3>
        {!isJoined && !isLoading && !error && (
          <button onClick={joinCall} style={{
            padding: '10px 20px',
            background: '#2c5530',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}>
            Start Video Call
          </button>
        )}
        {isJoined && (
          <button onClick={leaveCall} style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}>
            End Call
          </button>
        )}
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '20px',
        }}>
          <p>❌ {error}</p>
        </div>
      )}

      {isLoading && !isJoined && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '8px',
        }}>
          <p>Setting up camera and microphone... (demo mode)</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        minHeight: '300px',
      }}>
        <div style={{
          position: 'relative',
          background: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          aspectRatio: '16/9',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>
            {isJoined ? 'Your Video (demo)' : 'Camera preview'}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
          }}>You</div>
        </div>
        <div style={{
          position: 'relative',
          background: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          aspectRatio: '16/9',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>
            {isJoined ? 'Doctor (demo)' : 'Waiting for doctor...'}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
          }}>Doctor</div>
        </div>
      </div>
    </div>
  );
}