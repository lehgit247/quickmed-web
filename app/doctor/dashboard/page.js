'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DoctorVideoCall = dynamic(() => import('../../components/DoctorVideoCall'), {
  ssr: false,
  loading: () => <p>Loading doctor video call...</p>
});

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [currentConsultation, setCurrentConsultation] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [channelName, setChannelName] = useState('consultation-room-1');
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    const mockDoctor = {
      id: 'doc_001',
      name: 'Dr. Ada Okoye',
      specialty: 'General Practitioner',
      license: 'MD, MBBS'
    };
    setDoctor(mockDoctor);
  }, []);

  const checkForIncomingCalls = async () => {
    if (isAvailable && doctor && !currentConsultation && !incomingCall) {
      try {
        const response = await fetch('/api/consultation/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'doctor_available',
            doctorId: doctor.id
          }),
        });
        
        const result = await response.json();
        
        if (result.hasPatient && result.consultation) {
          setIncomingCall(result.consultation);
          setIsAvailable(false);
          console.log('📞 Incoming call detected:', result.consultation);
        }
      } catch (error) {
        console.error('Error checking for calls:', error);
      }
    }
  };

  useEffect(() => {
    if (isAvailable && doctor) {
      const interval = setInterval(checkForIncomingCalls, 3000); // Check every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isAvailable, doctor, incomingCall]);

  const endConsultation = () => {
    setCurrentConsultation(null);
    setIsAvailable(true);
    setIsCallActive(false);
    setIncomingCall(null);
  };

  const joinIncomingCall = () => {
    if (incomingCall) {
      setChannelName(incomingCall.channelName);
      setCurrentConsultation(incomingCall);
      setIsCallActive(true);
      setIncomingCall(null);
      
      // Notify server that doctor is joining
      fetch('/api/consultation/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'doctor_join',
          consultationId: incomingCall.id,
          doctorId: doctor.id
        })
      });
    }
  };

  const declineIncomingCall = () => {
    setIncomingCall(null);
    setIsAvailable(true);
    
    // Remove the declined consultation
    if (incomingCall) {
      fetch('/api/consultation/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'end_consultation',
          consultationId: incomingCall.id
        })
      });
    }
  };

  // ADD THIS FUNCTION - Replace your old startTestCall
  const startTestCall = () => {
    // Use same channel pattern as patient side
    const testChannel = `consult_${Date.now().toString().slice(-6)}`;
    
    setCurrentConsultation({
      id: 'test-consultation',
      patientName: 'Test Patient',
      symptoms: 'Test consultation',
      channelName: testChannel
    });
    setChannelName(testChannel); // Update the channel name
    setIsCallActive(true);
    
    console.log('🎥 Test call started on channel:', testChannel);
  };

  // Calculate waiting time
  const getWaitingTime = () => {
    if (!incomingCall) return 0;
    return Math.round((Date.now() - incomingCall.timestamp) / 1000);
  };

  // Format patient name - show "Unknown Patient" if no name provided
  const getPatientName = () => {
    if (!incomingCall) return 'Unknown Patient';
    return incomingCall.patientName && incomingCall.patientName !== 'Patient' 
      ? incomingCall.patientName 
      : 'Unknown Patient';
  };

  // Format symptoms - show default message if no specific symptoms
  const getSymptoms = () => {
    if (!incomingCall) return 'Requesting video consultation';
    
    if (incomingCall.symptoms && 
        incomingCall.symptoms !== 'Video consultation requested' && 
        incomingCall.symptoms !== 'Video consultation') {
      return incomingCall.symptoms;
    }
    
    return 'General consultation - no specific symptoms provided';
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1>👨‍⚕️ Doctor Video Dashboard</h1>
        <p>{doctor.name} - {doctor.specialty}</p>
        <div style={{ 
          padding: '8px 16px', 
          background: isAvailable ? '#28a745' : '#dc3545', 
          borderRadius: '20px',
          display: 'inline-block',
          marginTop: '10px'
        }}>
          {isAvailable ? '🟢 AVAILABLE' : '🔴 IN CONSULTATION'}
        </div>
      </div>

      {/* Incoming Call Notification */}
      {!isCallActive && incomingCall && (
        <div style={{ 
          background: '#e3f2fd', 
          padding: '25px', 
          borderRadius: '10px',
          marginBottom: '20px',
          color: 'black',
          border: '3px solid #2196f3',
          animation: 'pulse 2s infinite'
        }}>
          <h3 style={{ color: '#2196f3', marginBottom: '15px' }}>📞 INCOMING VIDEO CALL!</h3>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Patient:</strong> {getPatientName()}</p>
            <p><strong>Symptoms:</strong> {getSymptoms()}</p>
            <p><strong>Request Type:</strong> Video Consultation</p>
            <p><strong>Waiting Time:</strong> {getWaitingTime()} seconds</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={joinIncomingCall}
              style={{ 
                padding: '12px 24px', 
                background: '#28a745', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🎥 JOIN CALL NOW
            </button>
            
            <button 
              onClick={declineIncomingCall}
              style={{ 
                padding: '12px 24px', 
                background: '#dc3545', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ❌ DECLINE
            </button>
          </div>
        </div>
      )}

      {!isCallActive ? (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '40px', 
          borderRadius: '10px', 
          textAlign: 'center',
          color: 'black'
        }}>
          {!incomingCall ? (
            <>
              <h3>🕐 Waiting for Patient Calls</h3>
              <p>You will automatically receive video call requests from patients</p>
              
              <div style={{ marginTop: '20px', color: '#666', textAlign: 'left', display: 'inline-block' }}>
                <p>✅ Patients can request video consultations</p>
                <p>✅ You will be notified automatically</p>
                <p>✅ Click "Join Video Call" to connect</p>
                <p>✅ Calls are checked every 3 seconds</p>
              </div>

              {/* Test Call Section */}
              <div style={{ marginTop: '30px', padding: '20px', background: '#e8f5e8', borderRadius: '8px' }}>
                <h4>🧪 Test Video Call</h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  Use this to test the video call functionality
                </p>
                
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <strong>Current Channel:</strong>
                  <input 
                    type="text" 
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    style={{ 
                      marginLeft: '10px', 
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      width: '200px'
                    }}
                    placeholder="consultation-room-1"
                  />
                </label>
                
                <button 
                  onClick={startTestCall}
                  style={{ 
                    padding: '12px 24px', 
                    background: '#17a2b8', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  🎥 Start Test Call
                </button>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                  Note: Will create a new channel using pattern: consult_123456
                </p>
              </div>
            </>
          ) : (
            <div style={{ padding: '20px' }}>
              <h3>📞 Checking for calls...</h3>
              <p>Monitoring for incoming patient requests</p>
              <div style={{ marginTop: '20px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #007bff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <DoctorVideoCall 
          onCallEnd={endConsultation} 
          channelName={channelName}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { border-color: #2196f3; }
          50% { border-color: #64b5f6; }
          100% { border-color: #2196f3; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}