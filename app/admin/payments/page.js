'use client';
import { useState, useEffect } from 'react';
export const dynamic = 'force-dynamic';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [id, setId] = useState(''); // Added ID state

  // Extract URL parameters on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id');
      setId(urlId || '');
      
      // If there's an ID in the URL, you might want to filter by it
      if (urlId) {
        console.log('Filtering payments for ID:', urlId);
        // You could set a specific filter here or pass it to your API
      }
    }
  }, []);

  useEffect(() => {
    console.log('Current payments:', payments);
    console.log('Stats:', stats);
  }, [payments, stats]);

  useEffect(() => {
    fetchPayments();
  }, [filter, id]); // Added id as dependency

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let url = filter === 'all' 
        ? '/api/admin/payments'
        : `/api/admin/payments?status=${filter}`;
      
      // Add ID parameter if present
      if (id) {
        url += url.includes('?') ? `&id=${id}` : `?id=${id}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.data.payments);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const downloadReceipt = async (reference) => {
    try {
      const response = await fetch(`/api/payment/receipt/${reference}`);
      
      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${reference}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Receipt downloaded:', reference);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-container">
      <h1>💳 Payment Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">{formatCurrency(stats.revenue || 0)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Payments</h3>
          <p className="stat-number">{stats.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number success">{stats.completed || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Failed</h3>
          <p className="stat-number error">{stats.failed || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Payments
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={filter === 'failed' ? 'active' : ''}
          onClick={() => setFilter('failed')}
        >
          Failed
        </button>
        <button onClick={fetchPayments} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Show ID filter if present */}
      {id && (
        <div className="id-filter-badge">
          🔍 Filtering for ID: <strong>{id}</strong>
          <button onClick={() => {
            setId('');
            // Remove id from URL without page reload
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.delete('id');
              window.history.replaceState({}, '', url.toString());
            }
          }}>Clear</button>
        </div>
      )}

      {/* Payments Table */}
      {loading ? (
        <div className="loading">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="empty-state">
          <p>No payments found</p>
          <p>Make some test payments to see data here</p>
        </div>
      ) : (
        <div className="payments-table">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="reference">{payment.reference.substring(0, 10)}...</td>
                  <td>{payment.patientName || payment.email}</td>
                  <td>{payment.doctorName || 'N/A'}</td>
                  <td>{payment.consultationType || 'Consultation'}</td>
                  <td className="amount">{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`method-badge ${payment.method}`}>
                      {payment.method}
                    </span>
                  </td>
                  <td>{formatDate(payment.paidAt || payment.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  
                  <td>
                    <button 
                      onClick={() => downloadReceipt(payment.reference)}
                      className="download-btn"
                      title="Download Receipt"
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          color: #2c5530;
          margin-bottom: 30px;
          font-size: 2.5rem;
          font-weight: bold;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }
        .stat-card h3 {
          color: #000000;
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .stat-number {
          font-size: 2.2em;
          font-weight: bold;
          margin: 10px 0;
          color: #676666ff;
        }
        .stat-number.success {
          color: #28a745;
        }
        .stat-number.error {
          color: #dc3545;
        }
        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .filters button {
          padding: 10px 20px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          color: #000000;
          font-weight: 500;
        }
        .filters button.active {
          background: #2c5530;
          color: white;
          border-color: #2c5530;
        }
        .refresh-btn {
          background: #2c5530;
          color: white;
          border: none;
        }
        .id-filter-badge {
          background: #e3f2fd;
          padding: 10px 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #000000;
        }
        .id-filter-badge button {
          background: none;
          border: 1px solid #1565c0;
          color: #1565c0;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .id-filter-badge button:hover {
          background: #1565c0;
          color: white;
        }
        .payments-table {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
          color: #000000;
        }
        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }
        .reference {
          font-family: monospace;
          font-size: 12px;
          color: #666;
        }
        .amount {
          font-weight: bold;
          color: #2c5530;
        }
        .method-badge, .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .method-badge.card {
          background: #e8f5e8;
          color: #2c5530;
        }
        .method-badge.bank_transfer {
          background: #e3f2fd;
          color: #1565c0;
        }
        .status-badge.completed {
          background: #e8f5e8;
          color: #000000;
        }
        .status-badge.failed {
          background: #f8d7da;
          color: #000000;
        }
        .loading, .empty-state {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 10px;
          color: #666;
        }
        .download-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 5px 10px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .download-btn:hover {
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
}