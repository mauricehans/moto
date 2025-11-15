import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminService } from '../services/adminService';

const AdminOtpVerify: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [params] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await adminService.verifyAdminOTP(email, code);
      setSuccess(res.data?.message || 'Code valide');
      navigate(`/admin/password-change?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err: any) {
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await adminService.requestAdminOTP(email);
      setSuccess(res.data?.message || 'Code envoyé');
      setExpiresIn(60);
      const interval = setInterval(() => {
        setExpiresIn((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const qEmail = params.get('email');
    if (qEmail) {
      setEmail(qEmail);
      setSuccess(`Un code vous a été envoyé à ${qEmail}`);
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Vérification du code</h1>
        <p className="text-gray-600 mb-6">Un code a été envoyé à <span className="font-medium text-gray-900">{email}</span>. Entrez le code reçu (valide 60s).</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">Code</label>
            <input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="000000" required />
          </div>
          {expiresIn !== null && (
            <p className="text-xs text-gray-500">Code valable {expiresIn}s</p>
          )}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <button type="submit" disabled={isLoading || !email.trim() || !code.trim() || (expiresIn !== null && expiresIn <= 0)} className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50">
            {isLoading ? 'Vérification...' : 'Continuer'}
          </button>
          <button type="button" onClick={resendCode} disabled={isLoading || !email.trim()} className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Renvoyer le code
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOtpVerify;