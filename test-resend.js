// test-resend.js - Create this file in your project root
import { emailService } from './lib/emailService.js';

async function test() {
  console.log('Testing Resend email...');
  
  const result = await emailService.sendPaymentConfirmation(
    'eyamfrank2@gmail.com', // ← CHANGE TO YOUR EMAIL
    {
      reference: 'TEST_123',
      amount: 5000,
      currency: 'NGN',
      patientName: 'Test Patient',
      doctorName: 'Dr. Ada Okoye',
      consultationType: 'Video Consultation',
      method: 'card',
      paidAt: new Date().toISOString()
    }
  );
  
  console.log('Result:', result);
}

test();