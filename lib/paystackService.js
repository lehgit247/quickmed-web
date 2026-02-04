import axios from 'axios';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = 'sk_test_b77edbd7295cbd28d62566697bee1659a0fde997';

// Create axios instance with Paystack headers
const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const paystackService = {
  // Initialize transaction
  async initializeTransaction(email, amount, metadata = {}) {
    try {
      const response = await paystackAPI.post('/transaction/initialize', {
        email,
        amount: amount * 100, // Convert to kobo
        currency: 'NGN',
        metadata,
        callback_url: `http://localhost:3000/payment/verify`, 
      });

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to initialize transaction');
      }

      return response.data.data;
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment initialization failed');
    }
  },

  // Verify transaction
  async verifyTransaction(reference) {
    try {
      const response = await paystackAPI.get(`/transaction/verify/${reference}`);
      
      if (!response.data.status) {
        throw new Error(response.data.message || 'Verification failed');
      }

      return response.data.data;
    } catch (error) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  // Create transfer recipient for bank transfers
  async createTransferRecipient(bankDetails) {
    try {
      const response = await paystackAPI.post('/transferrecipient', {
        type: 'nuban',
        name: bankDetails.accountName,
        account_number: bankDetails.accountNumber,
        bank_code: bankDetails.bankCode,
        currency: 'NGN',
      });

      return response.data.data;
    } catch (error) {
      console.error('Paystack recipient error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Recipient creation failed');
    }
  },

  // Get list of banks
  async getBanks() {
    try {
      const response = await paystackAPI.get('/bank?currency=NGN');
      return response.data.data;
    } catch (error) {
      console.error('Paystack banks error:', error.response?.data || error.message);
      throw new Error('Failed to fetch banks');
    }
  },
};