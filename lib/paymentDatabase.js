// lib/paymentDatabase.js - SIMPLE IN-MEMORY ONLY
let payments = [];
console.log('📊 Payment database initialized');

export const paymentDatabase = {
  save(paymentData) {
    const payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    payments.push(payment);
    console.log('💾 Payment saved:', payment.reference);
    console.log('📊 Total payments:', payments.length);
    return payment;
  },

  findByReference(reference) {
    return payments.find(p => p.reference === reference);
  },

  getAll() {
    return [...payments].reverse();
  },

  getStats() {
    const total = payments.length;
    const completed = payments.filter(p => p.status === 'completed').length;
    const failed = payments.filter(p => p.status === 'failed').length;
    const revenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return { total, completed, failed, revenue };
  },

  // For testing
  clear() {
    payments = [];
    console.log('🗑️ Database cleared');
  }
};