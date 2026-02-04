'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsultPage() {
  const router = useRouter();
  const [step, setStep] = useState('form'); // 'form' or 'payment'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    symptoms: '',
    consultationType: 'video',
    doctor: 'Dr. Ada Okoye'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Patient data:', formData);
    
    // Move to payment step
    setStep('payment');
    
    // Store patient data temporarily (or pass via URL)
    localStorage.setItem('patientData', JSON.stringify(formData));
  };

  const handlePaymentComplete = () => {
    // After payment, go to video consult
    router.push(`/consult/video?payment=verified`);
  };

  if (step === 'form') {
    return (
      <div className="patient-form-container">
        <h1>Tell Us About Yourself</h1>
        <p>Please fill in your details to connect with a doctor</p>
        
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+234 801 234 5678"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="30"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Symptoms/Complaint *</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              required
              placeholder="Describe your symptoms, how long you've had them, any medications you're taking..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Consultation Type</label>
            <div className="consultation-options">
              <label>
                <input
                  type="radio"
                  name="consultationType"
                  value="video"
                  checked={formData.consultationType === 'video'}
                  onChange={handleInputChange}
                />
                <span>🎥 Video Consultation</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="consultationType"
                  value="voice"
                  checked={formData.consultationType === 'voice'}
                  onChange={handleInputChange}
                />
                <span>🎤 Voice Consultation</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="consultationType"
                  value="chat"
                  checked={formData.consultationType === 'chat'}
                  onChange={handleInputChange}
                />
                <span>💬 Chat Consultation</span>
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Proceed to Payment
          </button>
        </form>

        <style jsx>{`
          .patient-form-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          h1 {
            color: #2c5530;
            text-align: center;
            margin-bottom: 10px;
          }
          .patient-form {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-top: 30px;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
          }
          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .consultation-options {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 10px;
          }
          .consultation-options label {
            display: flex;
            align-items: center;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
          }
          .consultation-options input {
            width: auto;
            margin-right: 10px;
          }
          .submit-btn {
            width: 100%;
            padding: 15px;
            background: #2c5530;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
          }
          .submit-btn:hover {
            background: #3a7c42;
          }
        `}</style>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Complete Payment to Connect with Doctor</h1>
        <p>You will be redirected to the payment page</p>
        <button 
          onClick={() => {
            // Pass patient data to payment page
            const queryString = new URLSearchParams(formData).toString();
            router.push(`/payment?${queryString}&from=consult`);
          }}
          style={{
            background: '#2c5530',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Proceed to Payment
        </button>
      </div>
    );
  }
}