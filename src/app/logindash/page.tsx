'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import { securityQuestions } from '@/lib/auth';

export default function LoginDashboard() {
  const [isRecovering, setIsRecovering] = useState(false);
  const [answers, setAnswers] = useState({
    Q1: '',
    Q2: '',
    Q3: ''
  });
  const [recoveryError, setRecoveryError] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleLogin(username: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error('Invalid credentials');
    
    window.location.href = '/dashboard';
  }

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault();
    setRecoveryError('');

    const res = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });

    if (!res.ok) {
      setRecoveryError('Invalid answers');
      return;
    }

    const { newPassword } = await res.json();
    setNewPassword(newPassword);
  }

  if (newPassword) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Your New Password</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Please save this password somewhere safe. You will need to change it upon your next login.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-center font-mono">
            {newPassword}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          {isRecovering ? 'Password Recovery' : 'Sign in to Dashboard'}
        </h1>

        {isRecovering ? (
          <form onSubmit={handleRecovery} className="space-y-6">
            {Object.entries(securityQuestions).map(([key, { question }]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">
                  {question}
                </label>
                <input
                  type="text"
                  value={answers[key as keyof typeof answers]}
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}

            {recoveryError && (
              <div className="text-red-500 text-sm">{recoveryError}</div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => setIsRecovering(false)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={() => setIsRecovering(true)}
          />
        )}
      </div>
    </div>
  );
}