'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setMessage({ type: 'error', text: 'No verification token found in URL' });
    }
  }, [searchParams]);

  const handleVerifyEmail = async () => {
    if (!token) {
      setMessage({ type: 'error', text: 'No verification token available' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        // Redirect to login page after successful verification
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Verification failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click the button below to verify your email address
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {message && (
            <div
              className={`rounded-md p-4 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex">
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      message.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleVerifyEmail}
              disabled={isLoading || !token}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading || !token
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          {message?.type === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                You will be redirected to the login page in a few seconds...
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;