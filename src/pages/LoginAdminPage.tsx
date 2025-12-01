import { useState } from 'react';
import api from '../services/api';

const LoginAdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await api.post('/login/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      window.location.href = '/admin/super-admin';
    } catch (e: any) {
      setError(e.response?.data?.error || 'Connexion refusée');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Connexion Admin</h1>
        {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="login_email">Email</label>
            <input id="login_email" name="admin_email_input" autoComplete="off" className="w-full border rounded px-3 py-2" type="email" value={username} onChange={e=>setUsername(e.target.value)} required placeholder="" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="login_password">Mot de passe</label>
            <input id="login_password" name="admin_password_input" autoComplete="new-password" className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdminPage;
