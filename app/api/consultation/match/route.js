// app/api/consultation/match/route.js
let pendingConsultations = [];

export async function POST(request) {
  try {
    const {
      type,
      patientId,
      patientInfo,
      consultationId,
      consultationType = 'video',
      channelName
    } = await request.json();

    if (type === 'doctor_available') {
      // Doctor is available and waiting for calls
      // Return the first pending consultation
      const pendingCall = pendingConsultations[0];
      
      return Response.json({
        hasPatient: !!pendingCall,
        consultation: pendingCall || null,
        consultationId: pendingCall?.id || null
      });
    }

    if (type === 'patient_request') {
      const now = Date.now();
      const consultation = {
        id: `consult_${now}`,
        patientId: patientId || null,
        patientName: patientInfo?.name || 'Unknown Patient',
        symptoms: patientInfo?.symptoms || 'General consultation',
        consultationType,
        timestamp: now,
        channelName: channelName || `consultation_${now}`
      };
      
      pendingConsultations.push(consultation);
      
      return Response.json({
        success: true,
        consultationId: consultation.id,
        channelName: consultation.channelName
      });
    }

    if (type === 'doctor_join') {
      // Doctor joins a specific consultation
      const consultation = pendingConsultations.find(c => c.id === consultationId);
      if (consultation) {
        // Don't remove from pending yet - wait for connection
        return Response.json({
          success: true,
          consultation: consultation,
          channelName: consultation.channelName
        });
      } else {
        return Response.json({ 
          success: false, 
          error: 'Consultation not found' 
        });
      }
    }

    if (type === 'end_consultation') {
      // Remove consultation from pending list
      pendingConsultations = pendingConsultations.filter(c => c.id !== consultationId);
      return Response.json({ success: true });
    }

    return Response.json({ success: false, error: 'Invalid request type' });

  } catch (error) {
    console.error('Consultation match error:', error);
    return Response.json({ success: false, error: error.message });
  }
}

// Clean up old pending consultations every minute
setInterval(() => {
  const now = Date.now();
  pendingConsultations = pendingConsultations.filter(c => now - c.timestamp < 300000); // 5 minutes
}, 60000);
