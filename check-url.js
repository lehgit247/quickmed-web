// check-url.js
import { paystackService } from './lib/paystackService.js';

async function check() {
  console.log('🔍 Checking Paystack callback URL...');
  
  try {
    const result = await paystackService.initializeTransaction(
      'test@test.com',
      50,
      { test: 'callback-check' }
    );
    
    console.log('✅ Paystack returned URL:', result.authorization_url);
    console.log('📋 Full response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

check();