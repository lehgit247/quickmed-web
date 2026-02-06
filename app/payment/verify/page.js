'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default function PaymentVerify() {
  const [status, setStatus] = useState('verifying');
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    if (reference) {
      // Verify payment with your API
      verifyPayment(reference);
    } else {
      setStatus('error');
    }
  }, [reference]);

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
    router.push(`/consult?payment=${reference}&verified=true`);
  }, 3000);
      } else {
        setStatus('failed');
      }
    } catch (error) {
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
          <button onClick={() => router.push('/payment')}>Try Again</button>
        </>
      )}
      
      {status === 'error' && (
        <>
          <h1>⚠️ Error</h1>
          <p>Something went wrong. Please contact support.</p>
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
};