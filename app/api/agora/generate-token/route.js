import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

export async function POST(request) {
  try {
    const { channelName, uid, role = 'publisher' } = await request.json();

    if (!channelName) {
      return NextResponse.json(
        { error: 'Channel name is required' },
        { status: 400 }
      );
    }

    const appId = process.env.AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const agoraUid = uid || 0;

    if (!appId) {
      return NextResponse.json(
        { error: 'Agora App ID is not configured.' },
        { status: 500 }
      );
    }

    if (!appCertificate) {
      return NextResponse.json({
        token: null,
        appId,
        channelName,
        uid: agoraUid,
        expiration: null
      });
    }

    const tokenRole = role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      agoraUid,
      tokenRole,
      privilegeExpiredTs
    );

    return NextResponse.json({
      token,
      appId,
      channelName,
      uid: agoraUid,
      expiration: privilegeExpiredTs
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token: ' + error.message },
      { status: 500 }
    );
  }
}
