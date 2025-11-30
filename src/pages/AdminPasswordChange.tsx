import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const AdminPasswordChange: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = useMemo(() => params.get('email') || '', [params]);
  const code = useMemo(() => params.get('code') || '', [params]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }
    try {
      const res = await adminService.confirmAdminOTP(email, code, newPassword);
      setSuccess(res.data?.message || 'Mot de passe réinitialisé');
      if (res.data?.access && res.data?.refresh) {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        navigate('/admin');
      }
    } catch (err: any) {
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const lengthOk = newPassword.length >= 8;
  const upperOk = /[A-Z]/.test(newPassword);
  const lowerOk = /[a-z]/.test(newPassword);
  const digitOk = /[0-9]/.test(newPassword);
  const specialOk = /[^A-Za-z0-9]/.test(newPassword);
  const matchOk = newPassword.length > 0 && newPassword === confirmPassword;
  const allOk = lengthOk && upperOk && lowerOk && digitOk && specialOk && matchOk;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Définir le nouveau mot de passe</h1>
        <p className="text-gray-600 mb-6">Entrez deux fois votre nouveau mot de passe.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <div className="relative">
              <input id="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10" required />
              <button type="button" aria-label="Afficher le mot de passe" onClick={() => {
                const el = document.getElementById('new_password') as HTMLInputElement | null;
                if (el) el.type = el.type === 'password' ? 'text' : 'password';
              }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                {(() => {
                  const el = document.getElementById('new_password') as HTMLInputElement | null;
                  const isText = el?.type === 'text';
                  return isText ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />;
                })()}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-2 rounded bg-gray-100 overflow-hidden">
              <div className={`h-full ${allOk ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${[lengthOk, upperOk, lowerOk, digitOk, specialOk].filter(Boolean).length / 5 * 100}%` }}></div>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={lengthOk ? 'text-green-600' : 'text-gray-600'}>≥ 8 caractères</li>
              <li className={upperOk ? 'text-green-600' : 'text-gray-600'}>1 majuscule</li>
              <li className={lowerOk ? 'text-green-600' : 'text-gray-600'}>1 minuscule</li>
              <li className={digitOk ? 'text-green-600' : 'text-gray-600'}>1 chiffre</li>
              <li className={specialOk ? 'text-green-600' : 'text-gray-600'}>1 caractère spécial</li>
            </ul>
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <input id="confirm_password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10" required />
              <button type="button" aria-label="Afficher le mot de passe" onClick={() => {
                const el = document.getElementById('confirm_password') as HTMLInputElement | null;
                if (el) el.type = el.type === 'password' ? 'text' : 'password';
              }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                {(() => {
                  const el = document.getElementById('confirm_password') as HTMLInputElement | null;
                  const isText = el?.type === 'text';
                  return isText ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />;
                })()}
              </button>
            </div>
          </div>
          {!matchOk && confirmPassword.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-yellow-700 text-xs">Les mots de passe ne correspondent pas</p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}
          <button type="submit" disabled={isLoading || !allOk} className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50">
            {isLoading ? 'Validation...' : 'Changer le mot de passe'}
          </button>
          {success && (
            <Link to="/admin" className="block w-full text-center mt-3 text-red-600 hover:text-red-700">Aller au panneau d'administration</Link>
          )}
        </form>
        <div className="mt-4 text-center">
          <Link to="/admin/otp" className="text-sm text-red-600 hover:text-red-700">Retour à la vérification du code</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordChange;
