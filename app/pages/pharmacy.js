"use client";
import { useState } from "react";

export default function PharmacyPortal() {
  const [prescriptionCode, setPrescriptionCode] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPrescription = async () => {
    if (!prescriptionCode.trim()) {
      setError("Please enter a prescription code");
      return;
    }

    setLoading(true);
    setError("");
    setPrescription(null);

    try {
      const response = await fetch(`/api/prescriptions/${prescriptionCode}`);
      if (!response.ok) {
        throw new Error('Prescription not found');
      }
      const data = await response.json();
      setPrescription(data);
    } catch (error) {
      setError("Prescription not found or already used");
    } finally {
      setLoading(false);
    }
  };

  const markAsUsed = async () => {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionCode}/use`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pharmacyName: "QuickMed Partner Pharmacy" })
      });

      if (!response.ok) {
        throw new Error('Failed to mark prescription as used');
      }

      setSuccess('Prescription dispensed successfully!');
      setPrescription(null);
      setPrescriptionCode("");
    } catch (error) {
      setError('Error processing prescription');
    }
  };

  return (
    <section className="container consult">
      <h1 className="consult-title">🏥 Pharmacy Portal</h1>
      
      <div className="card">
        <h3>Enter Prescription Code</h3>
        <div className="search">
          <input
            type="text"
            placeholder="Enter prescription code (e.g., RX-123456)"
            value={prescriptionCode}
            onChange={(e) => setPrescriptionCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && fetchPrescription()}
          />
          <button onClick={fetchPrescription} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success-note">{success}</div>}

        {prescription && (
          <div className="prescription-details">
            <h3>📋 Prescription Details</h3>
            
            <div className="patient-info">
              <h4>Patient Information</h4>
              <p><strong>Name:</strong> {prescription.patientName}</p>
              <p><strong>Age:</strong> {prescription.patientAge}</p>
              <p><strong>Gender:</strong> {prescription.patientGender}</p>
              <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
            </div>

            <div className="doctor-info">
              <h4>Prescribing Doctor</h4>
              <p><strong>Name:</strong> {prescription.doctorName}</p>
              <p><strong>License:</strong> {prescription.doctorLicense}</p>
              <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
            </div>

            <div className="medications-section">
              <h4>💊 Medications to Dispense</h4>
              <div className="medications-table">
                <div className="table-header">
                  <div>Medication</div>
                  <div>Dosage</div>
                  <div>Frequency</div>
                  <div>Duration</div>
                  <div>Notes</div>
                </div>
                {prescription.medications.map((med, index) => (
                  <div key={index} className="table-row">
                    <div><strong>{med.name}</strong></div>
                    <div>{med.dosage}</div>
                    <div>{med.frequency}</div>
                    <div>{med.duration}</div>
                    <div>{med.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="instructions">
              <h4>Medical Instructions</h4>
              <p>{prescription.instructions}</p>
            </div>

            <div className="row">
              <button className="btn btn-primary" onClick={markAsUsed}>
                ✅ Mark as Dispensed
              </button>
              <button className="btn btn-ghost" onClick={() => setPrescription(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}