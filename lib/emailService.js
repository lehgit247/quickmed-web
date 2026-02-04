// lib/emailService.js - Using Resend
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_7CPsG5Qp_MHpQqfCq4LYHAEPBsiMS8P9o');

// Your verified domain email (or use Resend's test domain)
const FROM_EMAIL = 'onboarding@resend.dev';  // Resend's test domain
const REPLY_TO = 'support@quickmedcare.com'; // Your support email (change later)

export const emailService = {
  // Send payment confirmation email
  async sendPaymentConfirmation(toEmail, paymentData) {
    try {
      console.log('📧 Sending payment confirmation to:', toEmail);
      
      // Format date
      const formattedDate = new Date(paymentData.paidAt).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Format currency
      const formattedAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: paymentData.currency || 'NGN'
      }).format(paymentData.amount);
      
      const { data, error } = await resend.emails.send({
        from: `QuickMed Care <${FROM_EMAIL}>`,
        to: [toEmail],
        reply_to: REPLY_TO,
        subject: `Payment Confirmed - ${paymentData.reference}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation</title>
            <style>
              /* Reset styles */
              body, html {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f5f5f5;
              }
              
              /* Container */
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              
              /* Header */
              .header {
                background: linear-gradient(135deg, #2c5530 0%, #3a7c42 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                border-radius: 0 0 20px 20px;
              }
              
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              
              .header h2 {
                margin: 10px 0 0 0;
                font-size: 18px;
                font-weight: 400;
                opacity: 0.9;
              }
              
              /* Logo */
              .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 15px;
                display: inline-block;
              }
              
              /* Content */
              .content {
                padding: 40px 30px;
              }
              
              .greeting {
                font-size: 18px;
                margin-bottom: 25px;
                color: #2c5530;
              }
              
              /* Receipt Card */
              .receipt-card {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
                border: 1px solid #e9ecef;
              }
              
              .receipt-title {
                color: #2c5530;
                font-size: 20px;
                margin-bottom: 25px;
                font-weight: 600;
              }
              
              .receipt-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e9ecef;
              }
              
              .receipt-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
              }
              
              .receipt-label {
                color: #6c757d;
                font-weight: 500;
              }
              
              .receipt-value {
                color: #212529;
                font-weight: 600;
                text-align: right;
              }
              
              .total-row {
                border-top: 2px solid #2c5530;
                margin-top: 20px;
                padding-top: 20px;
                font-size: 18px;
              }
              
              /* Status Badge */
              .status-badge {
                display: inline-block;
                background: #d4edda;
                color: #155724;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
              }
              
              /* Next Steps */
              .next-steps {
                background: #e8f5e9;
                border-left: 4px solid #2c5530;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
              }
              
              .next-steps h3 {
                color: #2c5530;
                margin-top: 0;
              }
              
              /* Button */
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #2c5530 0%, #3a7c42 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                text-align: center;
                transition: transform 0.2s;
              }
              
              .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(44, 85, 48, 0.2);
              }
              
              /* Footer */
              .footer {
                text-align: center;
                padding: 30px;
                color: #6c757d;
                font-size: 14px;
                border-top: 1px solid #e9ecef;
                margin-top: 30px;
              }
              
              .footer a {
                color: #2c5530;
                text-decoration: none;
              }
              
              /* Responsive */
              @media (max-width: 600px) {
                .header {
                  padding: 30px 20px;
                }
                
                .content {
                  padding: 30px 20px;
                }
                
                .receipt-card {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <div class="logo">🏥 QuickMed Care</div>
                <h1>Payment Confirmed</h1>
                <h2>Thank you for choosing QuickMed Care</h2>
              </div>
              
              <!-- Content -->
              <div class="content">
                <p class="greeting">Hello <strong>${paymentData.patientName || 'Valued Patient'}</strong>,</p>
                <p>Your payment has been successfully processed and your medical consultation has been confirmed.</p>
                
                <!-- Receipt Card -->
                <div class="receipt-card">
                  <h3 class="receipt-title">Payment Receipt</h3>
                  
                  <div class="receipt-row">
                    <span class="receipt-label">Reference Number:</span>
                    <span class="receipt-value">${paymentData.reference}</span>
                  </div>
                  
                  <div class="receipt-row">
                    <span class="receipt-label">Payment Date:</span>
                    <span class="receipt-value">${formattedDate}</span>
                  </div>
                  
                  <div class="receipt-row">
                    <span class="receipt-label">Doctor:</span>
                    <span class="receipt-value">${paymentData.doctorName || 'Medical Consultant'}</span>
                  </div>
                  
                  <div class="receipt-row">
                    <span class="receipt-label">Service Type:</span>
                    <span class="receipt-value">${paymentData.consultationType || 'Medical Consultation'}</span>
                  </div>
                  
                  <div class="receipt-row">
                    <span class="receipt-label">Payment Method:</span>
                    <span class="receipt-value">
                      ${paymentData.method === 'card' ? '💳 Credit/Debit Card' : 
                        paymentData.method === 'bank_transfer' ? '🏦 Bank Transfer' : 
                        paymentData.method || 'Card'}
                    </span>
                  </div>
                  
                  <div class="receipt-row">
                    <span class="receipt-label">Status:</span>
                    <span class="receipt-value">
                      <span class="status-badge">✅ Completed</span>
                    </span>
                  </div>
                  
                  <div class="receipt-row total-row">
                    <span class="receipt-label">Total Amount:</span>
                    <span class="receipt-value" style="color: #2c5530; font-size: 20px;">${formattedAmount}</span>
                  </div>
                </div>
                
                <!-- Next Steps -->
                <div class="next-steps">
                  <h3>📋 Next Steps</h3>
                  <p><strong>Your consultation will begin shortly.</strong> Please ensure you have:</p>
                  <ul>
                    <li>Stable internet connection</li>
                    <li>Webcam and microphone ready</li>
                    <li>Your medical history notes (if any)</li>
                    <li>List of current medications</li>
                  </ul>
                  <p>You will receive a separate email with your consultation link.</p>
                </div>
                
                <!-- Contact Info -->
                <div style="text-align: center; margin: 40px 0;">
                  <p>Need help? We're here for you!</p>
                  <a href="mailto:support@quickmedcare.com" class="button">Contact Support</a>
                  <p style="text-align: center; margin: 20px 0;">
                 <a href="https://quickmedcare.com/api/payment/receipt/${paymentData.reference}" 
                 style="background: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    📄 Download Receipt
                 </a>
                    </p>
                    </div>
                 </div>
              
              <!-- Footer -->
              <div class="footer">
                <p>© ${new Date().getFullYear()} QuickMed Care. All rights reserved.</p>
                <p>
                  <a href="https://quickmedcare.com/privacy">Privacy Policy</a> | 
                  <a href="https://quickmedcare.com/terms">Terms of Service</a> | 
                  <a href="https://quickmedcare.com/contact">Contact Us</a>
                </p>
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
PAYMENT CONFIRMATION - QUICKMED CARE

Hello ${paymentData.patientName || 'Valued Patient'},

Your payment has been successfully processed.

PAYMENT DETAILS:
Reference: ${paymentData.reference}
Date: ${formattedDate}
Doctor: ${paymentData.doctorName || 'Medical Consultant'}
Service: ${paymentData.consultationType || 'Medical Consultation'}
Amount: ${formattedAmount}
Status: ✅ Completed

NEXT STEPS:
Your consultation will begin shortly. Please ensure you have:
- Stable internet connection
- Webcam and microphone ready
- Your medical history notes (if any)
- List of current medications

You will receive a separate email with your consultation link.

Need help? Contact us at support@quickmedcare.com

© ${new Date().getFullYear()} QuickMed Care
This is an automated email. Please do not reply.
        `
      });

      if (error) {
        console.error('❌ Resend error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Email sent via Resend:', data?.id);
      return { success: true, emailId: data?.id };
      
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send appointment reminder
  async sendAppointmentReminder(toEmail, appointmentData) {
    // To implement later
    console.log('📅 Appointment reminder would be sent to:', toEmail);
    return { success: true, simulated: true };
  },

  // Send payment failed notification
  async sendPaymentFailed(toEmail, paymentData) {
    try {
      const { data, error } = await resend.emails.send({
        from: `QuickMed Care <${FROM_EMAIL}>`,
        to: [toEmail],
        subject: `Payment Failed - ${paymentData.reference}`,
        html: `<h1>Payment Failed</h1><p>Your payment of ${paymentData.amount} ${paymentData.currency} failed.</p>`,
        text: `Payment failed for ${paymentData.reference}`
      });

      if (error) throw error;
      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error('Failed payment email error:', error);
      return { success: false, error: error.message };
    }
  }
};