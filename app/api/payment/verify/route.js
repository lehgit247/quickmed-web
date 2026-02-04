import { paymentDatabase } from '@/lib/paymentDatabase';
import { paystackService } from '@/lib/paystackService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  
  if (!reference) {
    return Response.json({ success: false, error: 'No reference provided' });
  }
  
  try {
    console.log('🔍 Verifying payment:', reference);
    
    // 1. First check our database
    const localPayment = paymentDatabase.findByReference(reference);
    
    if (localPayment) {
      console.log('✅ Found in local database');
      return Response.json({ 
        success: true, 
        data: localPayment,
        source: 'local'
      });
    }
    
    // 2. If not in database, check with Paystack
    console.log('🔍 Checking Paystack...');
    const paystackResult = await paystackService.verifyTransaction(reference);
    
    if (paystackResult.status === 'success') {
      console.log('✅ Paystack verification successful');
      
      // Save to our database
      const paymentInfo = {
        reference: paystackResult.reference,
        amount: paystackResult.amount / 100,
        currency: paystackResult.currency,
        status: 'completed',
        method: paystackResult.channel || 'card',
        email: paystackResult.customer?.email,
        patientName: paystackResult.customer?.name,
        paidAt: paystackResult.paid_at || new Date().toISOString()
      };
      
      const savedPayment = paymentDatabase.save(paymentInfo);
      
      return Response.json({ 
        success: true, 
        data: savedPayment,
        source: 'paystack'
      });
    } else {
      return Response.json({ 
        success: false, 
        error: 'Payment not completed',
        details: paystackResult
      });
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    });
  }
}