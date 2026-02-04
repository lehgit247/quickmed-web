// check-payments.js
import { paymentDatabase } from './lib/paymentDatabase.js';

console.log('📊 Database check:');
console.log('Total payments:', paymentDatabase.getAll().length);
console.log('All payments:', paymentDatabase.getAll());