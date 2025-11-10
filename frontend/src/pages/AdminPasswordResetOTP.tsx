import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const AdminPasswordResetOTP = () => {
  const [step, setStep] = useState(1); // 1: request OTP, 2: confirm OTP and reset password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await adminService.requestAdminOTP(email);
      setMessage('Un code a été envoyé. Utilisez le code: 123456');
      setStep(2);
    } catch (error) {
      setMessage('Erreur lors de la demande de code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await adminService.confirmAdminOTP(email, code, newPassword);
      setMessage('Mot de passe réinitialisé avec succès.');
      // Handle successful login, e.g., store tokens and redirect
      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        navigate('/admin');
      }
    } catch (error) {
      setMessage('Code invalide ou expiré.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('succès') || message.includes('123456') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        {step === 1 ? (
          <form onSubmit={handleRequestOTP}>
            <h2 className="text-2xl font-bold text-center mb-6">Réinitialiser le mot de passe par OTP</h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                placeholder="admin@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Envoi en cours...' : 'Recevoir le code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmOTP}>
            <h2 className="text-2xl font-bold text-center mb-6">Vérifier le code et réinitialiser</h2>
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code OTP</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                placeholder="123456"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Vérification...' : 'Réinitialiser le mot de passe'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPasswordResetOTP;