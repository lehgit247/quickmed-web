import { paystackService } from '../../../../lib/paystackService';

export async function POST(request) {
  try {
    const { email, amount, metadata } = await request.json();
    
    console.log('💰 Initializing payment for:', email, amount);
    
    const transactionData = await paystackService.initializeTransaction(
      email,
      amount,
      metadata
    );

    console.log('✅ Paystack response:', {
      hasUrl: !!transactionData.authorization_url,
      url: transactionData.authorization_url,
      reference: transactionData.reference
    });

    return Response.json({ 
      success: true, 
      data: {
        authorization_url: transactionData.authorization_url,
        reference: transactionData.reference,
        access_code: transactionData.access_code
      }
    });
    
  } catch (error) {
    console.error('❌ API Payment error:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No additional details'
    }, { status: 400 });
  }
}