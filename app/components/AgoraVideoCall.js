'use client';
import { useState, useEffect } from 'react';

export default function AgoraVideoCall({ onCallEnd }) {
  const [isMounted, setIsMounted] = useState(false);
  const [videoComponent, setVideoComponent] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Dynamically import the real video component
    const loadVideoComponent = async () => {
      try {
        const { default: RealVideoCall } = await import('./RealVideoCall');
        setVideoComponent(() => RealVideoCall);
      } catch (error) {
        console.error('Failed to load video component:', error);
      }
    };

    loadVideoComponent();
  }, []);

  if (!isMounted || !videoComponent) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'black' }}>
        <p>Loading video call...</p>
      </div>
    );
  }

  const VideoComponent = videoComponent;
  return <VideoComponent onCallEnd={onCallEnd} />;
}