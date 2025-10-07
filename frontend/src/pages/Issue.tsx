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
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Issue Credential</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and issue a new credential to the system with secure processing.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 mb-2">
                Credential ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="credentialId"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Enter unique credential ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="credentialData" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Data (JSON format)
              </label>
              <textarea
                id="credentialData"
                value={credentialData}
                onChange={(e) => setCredentialData(e.target.value)}
                placeholder='{"name": "John Doe", "type": "identity", "level": "basic"}'
                rows={4}
                className="form-textarea"
              />
              <p className="mt-2 text-sm text-gray-500">
                Optional: Additional credential data in JSON format
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1 sm:flex-none">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Issuing...
                  </span>
                ) : (
                  'Issue Credential'
                )}
              </button>
              <button type="button" onClick={handleReset} className="btn-secondary flex-1 sm:flex-none">
                Reset
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="alert-error mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-medium">Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {response && (
          <div className="alert-success mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 mb-2">Credential Issued Successfully!</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Message:</strong> {response.message}</p>
                  <p><strong>Handled by:</strong> {response.worker}</p>
                  <p><strong>Issued at:</strong> {new Date(response.issued_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">How it works</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Enter a unique credential ID
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Optionally add additional data in JSON format
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              The system will issue the credential and return which worker processed it
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              If the credential already exists, you'll get a notification
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Issue;