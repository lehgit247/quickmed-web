// test-email.js
import { emailService } from './lib/emailService.js';

async function testEmail() {
  console.log('Testing email service...');
  
  const testData = {
    reference: 'TEST_REF_123',
    amount: 5000,
    currency: 'NGN',
    patientName: 'Test Patient',
    doctorName: 'Dr. Ada Okoye',
    consultationType: 'Video Consultation',
    method: 'card',
    paidAt: new Date().toISOString()
  };
  
  const result = await emailService.sendPaymentConfirmation(
    'recipient@example.com',  // Change to your email
    testData
  );
  
  console.log('Email test result:', result);
}

testEmail();