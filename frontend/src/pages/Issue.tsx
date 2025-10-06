import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30001';

interface IssueResponse {
  message: string;
  worker: string;
  issued_at: string;
}

const Issue: React.FC = () => {
  const [credentialId, setCredentialId] = useState('');
  const [credentialData, setCredentialData] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<IssueResponse | null>(null);
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

      const result = await axios.post(`${API_BASE_URL}/issue`, payload);
      setResponse(result.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to issue credential');
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
    <div className="issue-page">
      <div className="container">
        <h1>Issue Credential</h1>
        <p>Create and issue a new credential to the system.</p>

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
              placeholder="Enter unique credential ID"
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
              placeholder='{"name": "John Doe", "type": "identity", "level": "basic"}'
              rows={4}
            />
            <small>Optional: Additional credential data in JSON format</small>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Issuing...' : 'Issue Credential'}
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
          <div className="alert alert-success">
            <h3>Credential Issued Successfully!</h3>
            <div className="response-details">
              <p><strong>Message:</strong> {response.message}</p>
              <p><strong>Handled by:</strong> {response.worker}</p>
              <p><strong>Issued at:</strong> {new Date(response.issued_at).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>How it works</h3>
          <ul>
            <li>Enter a unique credential ID</li>
            <li>Optionally add additional data in JSON format</li>
            <li>The system will issue the credential and return which worker processed it</li>
            <li>If the credential already exists, you'll get a notification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Issue;