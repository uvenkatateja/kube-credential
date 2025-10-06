import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_VERIFICATION_API_BASE_URL || 'http://localhost:30002';

interface VerifyResponse {
  valid: boolean;
  worker?: string;
  issued_at?: string;
  issued_by?: string;
  verified_at?: string;
  message?: string;
}

const Verify: React.FC = () => {
  const [credentialId, setCredentialId] = useState('');
  const [credentialData, setCredentialData] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentialId.trim()) {
      setError('Credential ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let payload: any = { id: credentialId };
      
      // Try to parse additional data as JSON
      if (credentialData.trim()) {
        try {
          const additionalData = JSON.parse(credentialData);
          payload = { ...payload, ...additionalData };
        } catch {
          // If not valid JSON, treat as simple key-value
          payload.data = credentialData;
        }
      }

      const result = await axios.post(`${API_BASE_URL}/verify`, payload);
      setResponse(result.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setResponse(err.response.data);
      } else {
        setError(err.response?.data?.error || 'Failed to verify credential');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCredentialId('');
    setCredentialData('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="verify-page">
      <div className="container">
        <h1>Verify Credential</h1>
        <p>Check if a credential has been issued and is valid.</p>

        <form onSubmit={handleSubmit} className="credential-form">
          <div className="form-group">
            <label htmlFor="credentialId">
              Credential ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="credentialId"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="Enter credential ID to verify"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="credentialData">
              Additional Data (JSON format)
            </label>
            <textarea
              id="credentialData"
              value={credentialData}
              onChange={(e) => setCredentialData(e.target.value)}
              placeholder='{"name": "John Doe", "type": "identity"}'
              rows={4}
            />
            <small>Optional: Additional credential data for verification</small>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Verifying...' : 'Verify Credential'}
            </button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className={`alert ${response.valid ? 'alert-success' : 'alert-warning'}`}>
            <h3>{response.valid ? 'Credential Valid ✓' : 'Credential Invalid ✗'}</h3>
            <div className="response-details">
              {response.valid ? (
                <>
                  <p><strong>Status:</strong> Valid credential found</p>
                  <p><strong>Verified by:</strong> {response.worker}</p>
                  <p><strong>Originally issued by:</strong> {response.issued_by}</p>
                  <p><strong>Issued at:</strong> {response.issued_at ? new Date(response.issued_at).toLocaleString() : 'N/A'}</p>
                  <p><strong>Verified at:</strong> {response.verified_at ? new Date(response.verified_at).toLocaleString() : 'N/A'}</p>
                </>
              ) : (
                <>
                  <p><strong>Status:</strong> Credential not found or invalid</p>
                  <p><strong>Checked by:</strong> {response.worker}</p>
                  {response.message && <p><strong>Message:</strong> {response.message}</p>}
                </>
              )}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>How it works</h3>
          <ul>
            <li>Enter the credential ID you want to verify</li>
            <li>Optionally include additional data that should match</li>
            <li>The system will check if the credential was previously issued</li>
            <li>You'll get verification status and details about when/where it was issued</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Verify;