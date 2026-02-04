// app/api/agora/generate-token/route.js
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

// Handle GET requests (for testing in browser)
export async function GET(request) {
  try {
    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

    console.log('🔧 Testing Agora API Route');
    console.log('App ID:', APP_ID ? '✅ Present' : '❌ Missing');
    console.log('App Certificate:', APP_CERTIFICATE ? '✅ Present' : '❌ Missing');

    return new Response(JSON.stringify({
      message: 'Agora API is working!',
      appIdConfigured: !!APP_ID,
      appCertificateConfigured: !!APP_CERTIFICATE,
      note: 'Use POST method to generate tokens'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Error in GET route:', error);
    return new Response(JSON.stringify({ error: 'API test failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle POST requests (for generating tokens)
export async function POST(request) {
  try {
    const { channelName, uid, role = 'publisher' } = await request.json();
    
    console.log('🔑 Generating Agora token for channel:', channelName);
    
    if (!channelName) {
      return new Response(JSON.stringify({ error: 'Channel name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

    console.log('🔧 Agora Config - App ID:', APP_ID ? '✅ Present' : '❌ Missing');
    console.log('🔧 Agora Config - Certificate:', APP_CERTIFICATE ? '✅ Present' : '❌ Missing');

    if (!APP_ID || !APP_CERTIFICATE) {
      return new Response(JSON.stringify({ 
        error: 'Agora credentials not configured. Check your .env.local file' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Set token expiration time (1 hour)
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Generate token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid || 0,
      role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
      privilegeExpiredTs
    );

    console.log('✅ Agora token generated successfully for channel:', channelName);

    return new Response(JSON.stringify({
      token,
      appId: APP_ID,
      channelName,
      uid: uid || 0,
      message: 'Token generated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Error generating Agora token:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate token: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}