import { emailService } from '@/lib/emailService';
import { paymentDatabase } from '@/lib/paymentDatabase';
import crypto from 'crypto';

// Your Paystack secret key
const PAYSTACK_SECRET_KEY = 'sk_test_b77edbd7295cbd28d62566697bee1659a0fde997';

// Verify Paystack webhook signature
function verifyPaystackSignature(body, signature) {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');
  
  return hash === signature;
}

// Handle successful payment
async function handleSuccessfulPayment(paymentData) {
  console.log('🔄 Processing successful payment:', paymentData.reference);
  console.log('💰 Payment data received:', {
    reference: paymentData.reference,
    amount: paymentData.amount,
    email: paymentData.customer?.email
  });
  
  const paymentInfo = {
    reference: paymentData.reference,
    amount: paymentData.amount / 100,
    currency: paymentData.currency,
    status: 'completed',
    method: paymentData.channel || 'card',
    email: paymentData.customer?.email,
    patientName: paymentData.customer?.name,
    consultationType: paymentData.metadata?.consultation_type,
    doctorName: paymentData.metadata?.doctor_name,
    patientId: paymentData.metadata?.patient_id,
    paidAt: paymentData.paid_at || new Date().toISOString()
  };
  
  // Save to database
  const savedPayment = paymentDatabase.save(paymentInfo);
  console.log('💾 Database updated:', savedPayment.id);
  
  // Send email notification
  // if (paymentInfo.email) {
    // const emailResult = await emailService.sendPaymentConfirmation(
      // paymentInfo.email,
      // paymentInfo
   // );
    
    // if (emailResult.success) {
      // console.log('📧 Email sent successfully to:', paymentInfo.email);
    // } else {
      // console.error('❌ Failed to send email:', emailResult.error);
    // }
  // } else {
    // console.log('ℹ️ No email address for notification');
  //}
}

// Handle successful bank transfer
async function handleSuccessfulTransfer(transferData) {
  console.log('🔄 Processing successful transfer:', transferData.reference);
  
  const transferInfo = {
    reference: transferData.reference,
    amount: transferData.amount / 100,
    recipient: transferData.recipient?.name,
    accountNumber: transferData.recipient?.details?.account_number,
    metadata: transferData.metadata,
    status: 'completed',
    method: 'bank_transfer',
    email: 'bank_transfer@quickmedcare.com',
    paidAt: new Date().toISOString()
  };
  
  console.log('📋 Transfer info:', transferInfo);
  
  // Save to database
  const savedTransfer = paymentDatabase.save(transferInfo);
  console.log('💾 Transfer saved to database:', savedTransfer.id);
}

// Handle failed payment
async function handleFailedPayment(failedData) {
  console.log('🔄 Processing failed payment:', failedData.reference);
  
  const failedInfo = {
    reference: failedData.reference,
    reason: failedData.gateway_response || 'Payment failed',
    amount: failedData.amount / 100,
    email: failedData.customer?.email,
    status: 'failed',
    method: failedData.channel || 'card',
    failedAt: new Date().toISOString()
  };
  
  console.log('📋 Failed payment info:', failedInfo);
  
  // Save failed payment to database
  const savedFailed = paymentDatabase.save(failedInfo);
  console.log('💾 Failed payment saved to database:', savedFailed.id);
  console.log('📧 Would notify patient about failed payment:', failedInfo.email);
}

export async function POST(request) {
  try {
    console.log('🎯 WEBHOOK STARTED');
    console.log('🔍 Request headers:', Object.fromEntries(request.headers));
    // Get raw body and signature
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    
    console.log('📩 Webhook received');
    
    // Verify the webhook is from Paystack
    if (!verifyPaystackSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse the webhook event
    const event = JSON.parse(body);
    console.log('📋 Webhook event:', event.event);
    console.log('🔢 Payment reference:', event.data?.reference);
    console.log('📋 Parsed event data:', event);
    
    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        console.log('✅ Payment successful!');
        await handleSuccessfulPayment(event.data);
        break;
        
      case 'transfer.success':
        console.log('💰 Transfer successful!');
        await handleSuccessfulTransfer(event.data);
        break;
        
      case 'charge.failed':
        console.log('❌ Payment failed!');
        await handleFailedPayment(event.data);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event: ${event.event}`);
    }
    
    // Always return 200 to acknowledge receipt
    return Response.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}