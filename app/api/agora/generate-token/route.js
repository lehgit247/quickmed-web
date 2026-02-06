import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token'; // Updated import

export async function POST(request) {
  try {
    const { channelName, uid, role = 'publisher' } = await request.json();

    if (!channelName) {
      return NextResponse.json(
        { error: 'Channel name is required' },
        { status: 400 }
      );
    }

    // Use environment variables (set these in Vercel)
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      console.error('Missing Agora credentials');
      return NextResponse.json(
        { error: 'Video service configuration error. Please check server configuration.' },
        { status: 500 }
      );
    }

    // Generate token
    const tokenRole = role === 'admin' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid || 0,
      tokenRole,
      privilegeExpiredTs
    );

    console.log(`✅ Token generated for channel: ${channelName}, uid: ${uid}`);

    return NextResponse.json({
      token,
      appId,
      channelName,
      uid,
      expiration: privilegeExpiredTs
    });

  } catch (error) {
    console.error('❌ Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token: ' + error.message },
      { status: 500 }
    );
  }
}