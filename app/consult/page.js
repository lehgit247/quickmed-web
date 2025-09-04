"use client";
import { useState } from "react";

export default function ConsultPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    symptoms: "",
  });
  const [error, setError] = useState("");
  const [match, setMatch] = useState(null);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // simple validation: must have symptoms
    if (!form.symptoms.trim()) {
      setError("Please describe your symptoms.");
      return;
    }

    setError("");

    // fake "doctor matching" (demo)
    const doctors = [
      { name: "Dr. Ada Okoye", specialty: "General Practitioner", rating: "4.9", eta: "~2–5 min" },
      { name: "Dr. Femi Yusuf", specialty: "Internal Medicine", rating: "4.8", eta: "~3–6 min" },
    ];
    const pick = doctors[Math.floor(Math.random() * doctors.length)];

    setMatch({
      ...pick,
      caseSummary: form.symptoms.slice(0, 160),
    });
  }

  function reset() {
    setForm({ name: "", phone: "", city: "", symptoms: "" });
    setMatch(null);
  }

  return (
    <section className="container consult">
      <h1 className="consult-title">Quick Consultation</h1>

      {!match ? (
        <form onSubmit={handleSubmit} className="card consult-form">
          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g., Frank Eyam"
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="e.g., 0816 903 7959"
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="e.g., Abuja"
            />
          </label>

          <label>
            Describe your symptoms
            <textarea
              name="symptoms"
              rows={6}
              value={form.symptoms}
              onChange={onChange}
              placeholder="e.g., fever, cough, headache for 2 days…"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="row">
            <button type="submit" className="btn btn-primary">Connect to Doctor</button>
            <a href="/" className="btn btn-ghost">Back Home</a>
          </div>
        </form>
      ) : (
        <div className="card match">
          <div className="match-header">
            <img src="/quickmed-icon.png" alt="" className="match-icon" />
            <div>
              <div className="match-name">{match.name}</div>
              <div className="match-sub">
                {match.specialty} • ⭐ {match.rating} • ETA {match.eta}
              </div>
            </div>
          </div>

          <div className="match-summary">
            <div className="label">Your summary:</div>
            <div className="text">{match.caseSummary}</div>
          </div>

          <div className="row">
            <button
              className="btn btn-primary"
              onClick={() => alert("Starting secure chat (demo)")}
            >
              Start Chat
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => alert("Calling doctor (demo)")}
            >
              Call Doctor
            </button>
          </div>

          <div className="tiny">
            Not an emergency? If this worsens, please dial local emergency services.
          </div>

          <div className="row">
            <button className="btn btn-ghost" onClick={reset}>Start Over</button>
            <a href="/book" className="btn btn-ghost">Book Hospital</a>
          </div>
        </div>
      )}
    </section>
  );
}
