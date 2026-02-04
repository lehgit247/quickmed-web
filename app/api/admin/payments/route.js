import { paymentDatabase } from '../../../../lib/paymentDatabase';
export async function GET(request) {
  try {
    console.log('📊 Admin API called - Getting payments');
    console.log('📦 Total in database:', paymentDatabase.getAll().length);
    
    const payments = paymentDatabase.getAll();
    const stats = paymentDatabase.getStats();
    
    console.log('📤 Sending:', payments.length, 'payments');
    
    return Response.json({
      success: true,
      data: {
        payments: payments.slice(0, 50), // Limit to 50
        stats,
        total: payments.length
      }
    });
    
  } catch (error) {
    console.error('❌ Admin API error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}