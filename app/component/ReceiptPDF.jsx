import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #2c5530',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c5530',
    backgroundColor: '#f0f7f0',
    padding: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #eeeeee',
  },
  label: {
    fontSize: 10,
    color: '#666666',
    flex: 1,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTop: '2px solid #2c5530',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
    borderTop: '1px solid #eeeeee',
    paddingTop: 10,
  },
  statusBadge: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
  },
  watermark: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(44, 85, 48, 0.1)',
    fontSize: 48,
    transform: 'rotate(-45deg)',
  },
});

const ReceiptPDF = ({ payment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: payment.currency || 'NGN',
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.watermark}>
          <Text>QUICKMED CARE</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🏥 QuickMed Care</Text>
          <Text style={styles.title}>PAYMENT RECEIPT</Text>
          <Text style={styles.subtitle}>Official Payment Confirmation</Text>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT INFORMATION</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Receipt Number:</Text>
            <Text style={styles.value}>{payment.reference}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Date & Time:</Text>
            <Text style={styles.value}>{formatDate(payment.paidAt || payment.createdAt)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.statusBadge}>
                {payment.status === 'completed' ? '✅ PAID' : '❌ FAILED'}
              </Text>
            </View>
          </View>
        </View>

        {/* Patient & Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SERVICE DETAILS</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{payment.patientName || 'Not specified'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Patient Email:</Text>
            <Text style={styles.value}>{payment.email || 'Not specified'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Doctor:</Text>
            <Text style={styles.value}>{payment.doctorName || 'Medical Consultant'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Service Type:</Text>
            <Text style={styles.value}>
              {payment.consultationType === 'video' ? '🎥 Video Consultation' :
               payment.consultationType === 'voice' ? '🎤 Voice Consultation' :
               payment.consultationType === 'chat' ? '💬 Chat Consultation' :
               payment.consultationType === 'emergency' ? '🚨 Emergency Consultation' :
               'Medical Consultation'}
            </Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>
              {payment.method === 'card' ? '💳 Credit/Debit Card' :
               payment.method === 'bank_transfer' ? '🏦 Bank Transfer' :
               payment.method === 'mobile' ? '📱 Mobile Money' :
               payment.method === 'insurance' ? '🛡️ Insurance Claim' :
               payment.method || 'Not specified'}
            </Text>
          </View>
        </View>

        {/* Amount Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AMOUNT BREAKDOWN</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Consultation Fee:</Text>
            <Text style={styles.value}>{formatCurrency(payment.amount)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Processing Fee:</Text>
            <Text style={styles.value}>{formatCurrency(0)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Tax (VAT):</Text>
            <Text style={styles.value}>{formatCurrency(0)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
            <Text style={styles.totalValue}>{formatCurrency(payment.amount)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>QuickMed Care Limited • RC: 1234567</Text>
          <Text>123 Medical Street, Lagos, Nigeria • support@quickmedcare.com</Text>
          <Text>Tel: +234 800 123 4567 • www.quickmedcare.com</Text>
          <Text style={{ marginTop: 10 }}>
            This is an official receipt. Please retain for your records.
          </Text>
          <Text>Receipt ID: {payment.reference} • Generated: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;