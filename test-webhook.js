// test-webhook.js - UPDATED VERSION
const axios = require('axios');
const crypto = require('crypto');

// Your Paystack secret key
const PAYSTACK_SECRET_KEY = 'sk_test_b77edbd7295cbd28d62566697bee1659a0fde997';

// Generate a valid signature
function generateSignature(body) {
  return crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest('hex');
}

async function testWebhook() {
  try {
    console.log('🚀 Testing webhook endpoint...');
    
    // Create test payment data
    const webhookData = {
      event: 'charge.success',
      data: {
        id: 123456789,
        domain: 'test',
        status: 'success',
        reference: 'test_ref_' + Date.now(),
        amount: 500000,
        currency: 'NGN',
        channel: 'card',
        customer: {
          id: 12345,
          email: 'testpatient@quickmedcare.com',
          name: 'Test Patient'
        },
        metadata: {
          consultation_type: 'video',
          doctor_name: 'Dr. Ada Okoye',
          patient_id: 'test_patient_123'
        },
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    };
    
    // Generate REAL signature
    const signature = generateSignature(webhookData);
    console.log('🔐 Generated signature:', signature.substring(0, 20) + '...');
    
    // Send to your webhook endpoint
    const response = await axios.post('http://localhost:3000/api/payment/webhook', webhookData, {
      headers: {
        'Content-Type': 'application/json',
        'x-paystack-signature': signature
      }
    });
    
    console.log('✅ Webhook test SUCCESS!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Webhook test FAILED!');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testWebhook();