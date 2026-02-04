'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { paystackService } from '../../lib/paystackService';

const translations = {
  en: {
    securePayment: "Secure Payment",
    paymentFor: "Payment for",
    videoConsultation: "Video Consultation",
    voiceConsultation: "Voice Consultation", 
    chatConsultation: "Chat Consultation",
    emergencyConsultation: "Emergency Consultation",
    totalAmount: "Total Amount",
    selectPayment: "Select Payment Method",
    cardPayment: "Credit/Debit Card",
    bankTransfer: "Bank Transfer", 
    mobileMoney: "Mobile Money",
    insurance: "Insurance Claim",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    nameOnCard: "Name on Card",
    payNow: "Pay Now",
    cancel: "Cancel",
    processing: "Processing...",
    success: "Payment Successful!",
    redirecting: "Redirecting to consultation...",
    payWith: "Pay with",
    enterCardDetails: "Enter card details",
    mmYY: "MM/YY",
    secureEncryption: "Your payment is securely encrypted",
    acceptedCards: "We accept Visa, Mastercard, and Verve cards",
    bankDetails: "Bank Transfer Details",
    accountNumber: "Account Number",
    accountName: "Account Name", 
    bankName: "Bank Name",
    amountToTransfer: "Amount to Transfer",
    transferNote: "Please transfer the exact amount to the account below. Your consultation will be activated after payment confirmation.",
    mobileInstructions: "Select your mobile money provider",
    mpesa: "M-Pesa",
    airtelMoney: "Airtel Money",
    tigoPesa: "Tigo Pesa",
    orangeMoney: "Orange Money",
    phoneNumber: "Phone Number",
    insuranceProvider: "Insurance Provider",
    policyNumber: "Policy Number",
    verifyCoverage: "Verify Coverage",
    coverageVerified: "Coverage Verified",
    checkingCoverage: "Checking coverage...",
    payWithInsurance: "Pay with Insurance"
  },
  fr: {
    securePayment: "Paiement Sécurisé",
    paymentFor: "Paiement pour",
    videoConsultation: "Consultation Vidéo",
    voiceConsultation: "Consultation Vocale",
    chatConsultation: "Consultation par Chat", 
    emergencyConsultation: "Consultation d'Urgence",
    totalAmount: "Montant Total",
    selectPayment: "Sélectionnez le Mode de Paiement",
    cardPayment: "Carte de Crédit/Débit",
    bankTransfer: "Virement Bancaire",
    mobileMoney: "Mobile Money", 
    insurance: "Assurance",
    cardNumber: "Numéro de Carte",
    expiryDate: "Date d'Expiration",
    cvv: "CVV",
    nameOnCard: "Nom sur la Carte",
    payNow: "Payer Maintenant",
    cancel: "Annuler",
    processing: "Traitement...",
    success: "Paiement Réussi!",
    redirecting: "Redirection vers la consultation...",
    payWith: "Payer avec",
    enterCardDetails: "Entrez les détails de la carte",
    mmYY: "MM/AA",
    secureEncryption: "Votre paiement est crypté de manière sécurisée",
    acceptedCards: "Nous acceptons les cartes Visa, Mastercard et Verve",
    bankDetails: "Détails du Virement Bancaire",
    accountNumber: "Numéro de Compte",
    accountName: "Nom du Compte",
    bankName: "Nom de la Banque", 
    amountToTransfer: "Montant à Transférer",
    transferNote: "Veuillez transférer le montant exact sur le compte ci-dessous. Votre consultation sera activée après confirmation du paiement.",
    mobileInstructions: "Sélectionnez votre fournisseur de mobile money",
    mpesa: "M-Pesa",
    airtelMoney: "Airtel Money", 
    tigoPesa: "Tigo Pesa",
    orangeMoney: "Orange Money",
    phoneNumber: "Numéro de Téléphone",
    insuranceProvider: "Assureur",
    policyNumber: "Numéro de Police",
    verifyCoverage: "Vérifier la Couverture",
    coverageVerified: "Couverture Vérifiée",
    checkingCoverage: "Vérification de la couverture...",
    payWithInsurance: "Payer avec l'Assurance"
  }
};

export default function PaymentPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get patient data from URL
  const patientName = searchParams.get('name') || 'Patient';
  const patientPhone = searchParams.get('email') || searchParams.get('phone') || '';
  const patientSymptoms = searchParams.get('symptoms') || '';
  const patientCity = searchParams.get('city') || '';
  const selectedDoctor = searchParams.get('doctor') || 'Dr. Ada Okoye';
  const consultationType = searchParams.get('type') || 'video';
  const amount = searchParams.get('amount') || '5000'; // in cents/kobo

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    phoneNumber: '',
    insuranceProvider: '',
    policyNumber: ''
  });
  const [coverageStatus, setCoverageStatus] = useState('');

  const consultationTypes = {
    video: { name: t.videoConsultation, price: 5000 },
    voice: { name: t.voiceConsultation, price: 3000 },
    chat: { name: t.chatConsultation, price: 1500 },
    emergency: { name: t.emergencyConsultation, price: 10000 }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount / 100);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    setFormData({
      ...formData,
      cardNumber: value
    });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData({
      ...formData,
      expiryDate: value
    });
  };

  const verifyInsuranceCoverage = async () => {
    setCoverageStatus('checking');
    // Simulate API call
    setTimeout(() => {
      setCoverageStatus('verified');
    }, 2000);
  };

 // Updated handlePayment function with better error handling
const handlePayment = async (e) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    // Validate form data based on payment method
    if (!validatePaymentForm()) {
      throw new Error('Please fill in all required fields');
    }

    let paymentResult;

    switch (paymentMethod) {
      case 'card':
        paymentResult = await handleCardPayment();
        break;

      case 'transfer':
        paymentResult = await handleBankTransfer();
        break;

      case 'mobile':
        paymentResult = await handleMobileMoney();
        break;

      case 'insurance':
        paymentResult = await handleInsuranceClaim();
        break;

      default:
        throw new Error('Invalid payment method');
    }

    if (paymentResult.success) {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Save payment record to database
      await savePaymentRecord(paymentResult);
      
      setTimeout(() => {
        router.push('/consult');
      }, 2000);
    }
  } catch (error) {
    console.error('Payment error:', error);
    setIsProcessing(false);
    // Show user-friendly error message
    alert(`Payment failed: ${error.message}`);
  }
};

// Card payment handler
const handleCardPayment = async () => {
  const userEmail = 'test@quickmedcare.com';
  const amountInNaira = consultationTypes[consultationType]?.price / 100;

  try {
    const response = await fetch('/api/payment/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@quickmedcare.com',
        amount: amountInNaira,
        metadata: {
          consultation_type: consultationType,
          doctor_name: selectedDoctor,
          patient_name: patientName,
          patient_phone: patientPhone,
          patient_city: patientCity,
          symptoms: patientSymptoms,
          callback_url: 'http://localhost:3000/payment/verify' // Redirect to video consult
        }
      }),
    });

    const result = await response.json();

    if (!result.success) {
        console.error('❌ Payment initialization failed:', result);
        console.error('Error details:', result.error);
      throw new Error(result.error);
    }

    console.log('✅ Payment initialized:', result.data.reference);
    
    // Open Paystack in new tab
    const paystackWindow = window.open(
      result.data.authorization_url,
      '_blank'
    );
    
    if (!paystackWindow) {
      alert('Please allow popups for Paystack checkout');
      return { success: false, error: 'Popup blocked' };
    }
    
    // Check payment status every 3 seconds
    const checkInterval = setInterval(async () => {
      try {
        const verifyResponse = await fetch(`/api/payment/verify?reference=${result.data.reference}`);
        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
          clearInterval(checkInterval);
          paystackWindow.close();
          
          // Redirect to success page
          window.location.href = `/payment/verify?reference=${result.data.reference}&status=success`;
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    }, 3000);

    // Stop checking after 2 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      console.log('⏰ Payment check timeout');
    }, 120000);

    return { success: true, reference: result.data.reference };
    
  } catch (error) {
    console.error('❌ Payment failed:', error);
    throw new Error(`Payment initialization failed: ${error.message}`);
  }
};

// Form validation
const validatePaymentForm = () => {
  switch (paymentMethod) {
    case 'card':
      return formData.cardNumber && formData.expiryDate && formData.cvv && formData.nameOnCard;
    
    case 'mobile':
      return formData.phoneNumber;
    
    case 'insurance':
      return formData.insuranceProvider && formData.policyNumber && coverageStatus === 'verified';
    
    case 'transfer':
      return true; // Bank transfer doesn't need form validation
    
    default:
      return false;
  }
};

// Save payment record (simplified)
const savePaymentRecord = async (paymentResult) => {
  // In a real app, you'd save to your database
  const paymentRecord = {
    id: paymentResult.reference,
    amount: consultationTypes[consultationType]?.price,
    method: paymentMethod,
    status: 'completed',
    createdAt: new Date().toISOString(),
    consultationType,
    selectedDoctor,
  };
  
  console.log('Payment record:', paymentRecord);
  // await apiCall to save to database
};

  if (isSuccess) {
    return (
      <div className="container">
        <div className="success-payment">
          <div className="success-icon">✅</div>
          <h1>{t.success}</h1>
          <p>{t.redirecting}</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container payment-container">
      <div className="payment-header">
        <h1>🔒 {t.securePayment}</h1>
        <p>{t.paymentFor}: <strong>{consultationTypes[consultationType]?.name}</strong></p>
      </div>

      <div className="payment-summary">
        <div className="summary-item">
          <span>Consultation Type:</span>
          <span>{consultationTypes[consultationType]?.name}</span>
        </div>
        <div className="summary-item">
          <span>Doctor:</span>
          <span>{selectedDoctor}</span>
        </div>
        <div className="summary-item total">
          <span>{t.totalAmount}:</span>
          <span>{formatAmount(consultationTypes[consultationType]?.price)}</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>{t.selectPayment}</h3>
        <div className="method-options">
          <button 
            className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            💳 {t.cardPayment}
          </button>
          <button 
            className={`method-btn ${paymentMethod === 'transfer' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('transfer')}
          >
            🏦 {t.bankTransfer}
          </button>
          <button 
            className={`method-btn ${paymentMethod === 'mobile' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('mobile')}
          >
            📱 {t.mobileMoney}
          </button>
          <button 
            className={`method-btn ${paymentMethod === 'insurance' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('insurance')}
          >
            🛡️ {t.insurance}
          </button>
        </div>
      </div>

      <form onSubmit={handlePayment} className="payment-form">
        {paymentMethod === 'card' && (
          <div className="form-section">
            <h4>💳 {t.payWith} Card</h4>
            <p className="secure-note">{t.secureEncryption}</p>
            <p className="accepted-cards">{t.acceptedCards}</p>
            
            <div className="form-group">
              <label>{t.cardNumber}</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t.expiryDate}</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder={t.mmYY}
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t.cvv}</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t.nameOnCard}</label>
              <input
                type="text"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
          </div>
        )}

        {paymentMethod === 'transfer' && (
          <div className="form-section">
            <h4>🏦 {t.bankTransfer}</h4>
            <p className="transfer-note">{t.transferNote}</p>
            
            <div className="bank-details">
              <div className="detail-item">
                <span>{t.bankName}:</span>
                <span>QuickMed Care Bank</span>
              </div>
              <div className="detail-item">
                <span>{t.accountNumber}:</span>
                <span>1234567890</span>
              </div>
              <div className="detail-item">
                <span>{t.accountName}:</span>
                <span>QuickMed Care Ltd</span>
              </div>
              <div className="detail-item">
                <span>{t.amountToTransfer}:</span>
                <span className="amount">{formatAmount(consultationTypes[consultationType]?.price)}</span>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'mobile' && (
          <div className="form-section">
            <h4>📱 {t.mobileMoney}</h4>
            <p>{t.mobileInstructions}</p>
            
            <div className="mobile-providers">
              <button type="button" className="provider-btn">📞 {t.mpesa}</button>
              <button type="button" className="provider-btn">📱 {t.airtelMoney}</button>
              <button type="button" className="provider-btn">📲 {t.tigoPesa}</button>
              <button type="button" className="provider-btn">🍊 {t.orangeMoney}</button>
            </div>

            <div className="form-group">
              <label>{t.phoneNumber}</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+234 801 234 5678"
                required
              />
            </div>
          </div>
        )}

        {paymentMethod === 'insurance' && (
          <div className="form-section">
            <h4>🛡️ {t.insurance}</h4>
            
            <div className="form-group">
              <label>{t.insuranceProvider}</label>
              <select 
                name="insuranceProvider" 
                value={formData.insuranceProvider}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Provider</option>
                <option value="nhis">NHIS</option>
                <option value="redcare">RedCare</option>
                <option value="avon">Avon HMO</option>
                <option value="hygeia">Hygeia</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t.policyNumber}</label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleInputChange}
                placeholder="Enter policy number"
                required
              />
            </div>

            <button 
              type="button" 
              className="verify-btn"
              onClick={verifyInsuranceCoverage}
              disabled={coverageStatus === 'checking' || !formData.insuranceProvider || !formData.policyNumber}
            >
              {coverageStatus === 'checking' ? t.checkingCoverage : t.verifyCoverage}
            </button>

            {coverageStatus === 'verified' && (
              <div className="coverage-verified">
                ✅ {t.coverageVerified} - {formatAmount(0)} copay
              </div>
            )}
          </div>
        )}

        <div className="payment-actions">
          <button 
            type="submit" 
            className="pay-btn"
            disabled={isProcessing || (paymentMethod === 'insurance' && coverageStatus !== 'verified')}
          >
            {isProcessing ? t.processing : paymentMethod === 'insurance' ? t.payWithInsurance : t.payNow}
          </button>
          <Link href="/consult" className="cancel-btn">
            {t.cancel}
          </Link>
        </div>
      </form>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          color: #000000;
        }
        .payment-header {
          text-align: center;
          margin-bottom: 30px;
          color: #000000;
        }
        .payment-header h1 {
          color: #faf9f9ff;
          margin-bottom: 10px;
        }
        .payment-header p {
          color: #fbf7f7ff;
        }
        .payment-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          color: #000000;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #000000;
        }
        .summary-item.total {
          border-top: 1px solid #ddd;
          padding-top: 10px;
          font-weight: bold;
          font-size: 1.2em;
          color: #000000;
        }
        .payment-methods {
          margin-bottom: 30px;
          color: #000000;
        }
        .payment-methods h3 {
          color: #000000;
        }
        .method-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 15px;
        }
        .method-btn {
          padding: 15px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          color: #000000;
        }
        .method-btn.active {
          border-color: #2c5530;
          background: #e8f5e8;
          color: #000000;
        }
        .payment-form {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          color: #000000;
        }
        .form-section {
          margin-bottom: 30px;
          color: #000000;
        }
        .form-section h4 {
          color: #000000;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #000000;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          color: #000000;
          background: white;
        }
        .form-group input::placeholder {
          color: #666;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .secure-note, .transfer-note {
          color: #000000;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .accepted-cards {
          color: #000000;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .bank-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          color: #000000;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          color: #000000;
        }
        .detail-item .amount {
          font-weight: bold;
          color: #000000;
        }
        .mobile-providers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        .provider-btn {
          padding: 15px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          color: #000000;
        }
        .verify-btn {
          width: 100%;
          padding: 12px;
          background: #17a2b8;
          color: #000000;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 15px;
        }
        .verify-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          color: #000000;
        }
        .coverage-verified {
          background: #d4edda;
          color: #000000;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          font-weight: bold;
        }
        .payment-actions {
          display: flex;
          gap: 15px;
        }
        .pay-btn {
          flex: 2;
          padding: 15px;
          background: #2c5530;
          color: #000000;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
        }
        .pay-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          color: #000000;
        }
        .cancel-btn {
          flex: 1;
          padding: 15px;
          background: #6c757d;
          color: #000000;
          text-decoration: none;
          text-align: center;
          border-radius: 6px;
        }
        .success-payment {
          text-align: center;
          padding: 60px 20px;
          color: #000000;
        }
        .success-payment h1 {
          color: #000000;
        }
        .success-payment p {
          color: #000000;
        }
        .success-icon {
          font-size: 4em;
          margin-bottom: 20px;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2c5530;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}