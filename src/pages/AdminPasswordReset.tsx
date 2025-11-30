import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

interface FormData {
  email: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
}

const AdminPasswordReset: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await adminService.requestAdminOTP(formData.email);
      setResponse(res.data);
      navigate(`/admin/otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      if (error.response?.data) {
        setResponse(error.response.data);
      } else {
        setResponse({ error: 'Erreur de connexion. Veuillez réessayer.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Réinitialisation de mot de passe
          </h1>
          <p className="text-gray-600">
            Entrez votre email administrateur pour recevoir un code de réinitialisation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder=""
              disabled={isLoading}
            />
          </div>

          {response?.error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{response.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.email.trim()}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </div>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'administration
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs">
            <strong>Note de sécurité :</strong> Cette fonctionnalité est réservée aux comptes administrateurs uniquement. 
            Le lien de réinitialisation sera valide pendant 24 heures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordReset;
