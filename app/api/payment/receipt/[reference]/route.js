import { paymentDatabase } from '@/lib/paymentDatabase';
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import ReceiptPDF from '../../../../component/ReceiptPDF';

export async function GET(request, { params }) {
  console.log('🧾 Receipt API called for reference:', params.reference);
  
  try {
    const { reference } = params;
    
    console.log('🔍 Looking for payment with reference:', reference);
    
    // Get payment from database
    const payment = paymentDatabase.findByReference(reference);
    
    console.log('📊 Payment found:', payment ? 'Yes' : 'No');
    
    if (!payment) {
      console.error('❌ Payment not found in database');
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    console.log('🎨 Creating PDF for payment:', payment.reference);
    
    // Create PDF
    const pdfBuffer = await renderToBuffer(
      <ReceiptPDF payment={payment} />
    );
    
    console.log('✅ PDF created successfully, size:', pdfBuffer.length, 'bytes');
    
    // Return PDF as response
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${reference}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('❌ Receipt generation error:', error);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to generate receipt', details: error.message },
      { status: 500 }
    );
  }
}