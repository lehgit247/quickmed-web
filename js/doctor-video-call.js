// Video Call System for Doctor
class DoctorVideoCall {
    constructor() {
        this.client = null;
        this.localAudioTrack = null;
        this.localVideoTrack = null;
        this.remoteUsers = [];
        this.isJoined = false;
        this.currentConsultationId = null;
        this.agoraRTC = null;
        this.init();
    }

    async init() {
        try {
            // Load Agora SDK
            const AgoraRTC = await import('https://download.agora.io/sdk/release/AgoraRTC_N-4.18.2.js');
            this.agoraRTC = AgoraRTC;
            this.client = AgoraRTC.createClient({ 
                mode: 'rtc', 
                codec: 'vp8' 
            });

            // Setup event listeners
            this.client.on('user-published', async (user, mediaType) => {
                await this.client.subscribe(user, mediaType);
                if (mediaType === 'video') {
                    this.remoteUsers.push(user);
                    user.videoTrack.play('remoteVideo');
                }
                if (mediaType === 'audio') {
                    user.audioTrack.play();
                }
                this.updateStatus('Patient joined the call', 'success');
            });

            this.client.on('user-unpublished', (user) => {
                this.remoteUsers = this.remoteUsers.filter(u => u.uid !== user.uid);
                this.updateStatus('Patient left the call', 'warning');
            });

            // Start checking for incoming calls
            this.startCallChecking();
        } catch (error) {
            console.error('Failed to initialize video call:', error);
        }
    }

    async startCallChecking() {
        setInterval(async () => {
            if (!this.isJoined) {
                await this.checkForIncomingCalls();
            }
        }, 5000);
    }

    async checkForIncomingCalls() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const response = await fetch('/api/consultation/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: 'doctor_available', 
                    doctorId: user.id || 'doc_001' 
                })
            });
            const result = await response.json();
            
            if (result.hasPatient && result.consultationId) {
                this.currentConsultationId = result.consultationId;
                this.showVideoCallInterface();
                this.updateStatus(`Incoming call from ${result.consultation.patientInfo?.name || 'Patient'}`, 'info');
                
                // Auto-join after 3 seconds
                setTimeout(() => {
                    this.joinCall();
                }, 3000);
            }
        } catch (error) {
            console.error('Error checking for calls:', error);
        }
    }

    showVideoCallInterface() {
        // Your implementation here
    }

    updateStatus(message, type) {
        // Your implementation here
    }

    async joinCall() {
        // Your implementation here
    }
}