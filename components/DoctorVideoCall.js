'use client';

import VideoCall from './videocall';
import AudioCallComponent from './AudioCallComponent';

export default function DoctorVideoCall({ channelName, consultation, onCallEnd }) {
  const isAudioCall = consultation?.consultationType === 'call';

  return (
    <div style={styles.container}>
      <div style={styles.summary}>
        <h2 style={styles.title}>Doctor Consultation Room</h2>
        <p style={styles.text}>
          Patient: {consultation?.patientName || 'Test Patient'}
        </p>
        <p style={styles.text}>
          Call Type: {isAudioCall ? 'Audio Consultation' : 'Video Consultation'}
        </p>
        <p style={styles.text}>
          Presenting Symptoms: {consultation?.symptoms || 'General consultation'}
        </p>
      </div>

      {isAudioCall ? (
        <AudioCallComponent
          channelName={channelName || consultation?.channelName}
          consultationId={consultation?.id}
          doctorInfo={{ name: 'QuickMed Doctor' }}
          autoStart
          registerPatient={false}
          onEndCall={onCallEnd}
        />
      ) : (
        <VideoCall
          channelName={channelName || consultation?.channelName}
          consultationId={consultation?.id}
          autoStart
          registerPatient={false}
          onCallEnd={onCallEnd}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gap: '16px'
  },
  summary: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px'
  },
  title: {
    margin: '0 0 8px',
    color: '#1f3d24',
    fontSize: '20px'
  },
  text: {
    margin: '4px 0',
    color: '#333'
  }
};
