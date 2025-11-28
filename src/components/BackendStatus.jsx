import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const BackendStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setStatus(null);

    try {
      // Test basic connectivity
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        })
      });

      const data = await response.json();
      
      setStatus({
        success: false, // We expect this to fail with invalid credentials
        status: response.status,
        statusText: response.statusText,
        data: data,
        message: `Backend is responding (Status: ${response.status})`
      });

    } catch (error) {
      setStatus({
        success: false,
        error: error.message,
        message: 'Backend connection failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Backend Connection Test</h3>
      
      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>

      {status && (
        <div className="mt-4 p-3 border rounded">
          <h4 className="font-medium mb-2">{status.message}</h4>
          
          {status.status && (
            <div className="text-sm space-y-1">
              <p><strong>Status:</strong> {status.status} {status.statusText}</p>
              {status.data && (
                <div>
                  <strong>Response:</strong>
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(status.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {status.error && (
            <div className="text-sm text-red-600">
              <strong>Error:</strong> {status.error}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Endpoint:</strong> {API_ENDPOINTS.AUTH.LOGIN}</p>
        <p><strong>Expected:</strong> 401 Unauthorized (for invalid test credentials)</p>
        <p><strong>Problem:</strong> 500 Internal Server Error indicates backend issues</p>
      </div>
    </div>
  );
};

export default BackendStatus;
