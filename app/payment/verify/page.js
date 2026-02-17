'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default function PaymentVerify() {
  const [status, setStatus] = useState('verifying');
  const [reference, setReference] = useState('');
  const [id, setId] = useState('');
  const router = useRouter();

  // Extract URL parameters on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('reference') || params.get('trxref');
      const urlId = params.get('id');
      
      setReference(ref || '');
      setId(urlId || '');
      
      if (ref) {
        // Verify payment with your API
        verifyPayment(ref);
      } else {
        setStatus('error');
      }
    }
  }, []);

  const verifyPayment = async (ref) => {
    try {
      const response = await fetch(`/api/payment/verify?reference=${ref}`);
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        
        // Get original patient data from localStorage or URL
        const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
        
        // Redirect back to consult page WITH payment reference
        setTimeout(() => {
          router.push(`/consult?payment=${ref}&verified=true${id ? `&id=${id}` : ''}`);
        }, 3000);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
    }
  };

  return (
    <div style={styles.container}>
      {status === 'verifying' && (
        <>
          <h1>🔍 Verifying Payment...</h1>
          <p>Please wait while we confirm your payment.</p>
          <div style={styles.spinner}></div>
        </>
      )}
      
      {status === 'success' && (
        <>
          <h1>✅ Payment Successful!</h1>
          <p>Thank you for your payment. Reference: {reference}</p>
          <p>You will receive a confirmation email shortly.</p>
          <p>Redirecting to consultation in 3 seconds...</p>
        </>
      )}
      
      {status === 'failed' && (
        <>
          <h1>❌ Payment Failed</h1>
          <p>Your payment could not be processed.</p>
          <button onClick={() => router.push('/payment')} style={styles.button}>
            Try Again
          </button>
        </>
      )}
      
      {status === 'error' && (
        <>
          <h1>⚠️ Error</h1>
          <p>Something went wrong. Please contact support.</p>
          <button onClick={() => router.push('/')} style={styles.button}>
            Go Home
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    maxWidth: '600px',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #2c5530',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '20px auto',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#2c5530',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '20px',
  }
};

// Add the keyframe animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}