import { useEffect, useState } from 'react';
import api from '../services/api';

interface AdminUser { id: number; username: string; email: string; is_superuser: boolean; is_active: boolean }

const SuperAdminPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', username: '', password: '', is_superuser: false });
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const fetchAdmins = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/superadmin/admins/');
      setAdmins(Array.isArray(res.data.admins) ? res.data.admins : []);
    } catch (e: any) {
      setError('Accès refusé ou erreur serveur');
      setShowLogin(true);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setShowLogin(true);
    } else {
      fetchAdmins();
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.post('/superadmin/admins/create/', form);
      setForm({ email: '', username: '', password: '', is_superuser: false });
      fetchAdmins();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Erreur lors de la création');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet admin ?')) return;
    setLoading(true); setError('');
    try {
      await api.delete(`/superadmin/admins/${id}/`);
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (e: any) {
      setError(e.response?.data?.error || 'Erreur lors de la suppression');
    } finally { setLoading(false); }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginLoading(true); setLoginError('');
    try {
      const res = await api.post('/login/', { username: loginForm.username, password: loginForm.password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setShowLogin(false);
      fetchAdmins();
    } catch (e: any) {
      setLoginError(e.response?.data?.error || 'Connexion refusée');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setShowLogin(true);
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Connexion Admin</h1>
          {loginError && <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{loginError}</div>}
          <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="login_email">Email</label>
              <input id="login_email" name="admin_email_input" autoComplete="off" className="w-full border rounded px-3 py-2" type="email" value={loginForm.username} onChange={e=>setLoginForm({...loginForm, username: e.target.value})} required placeholder="" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="login_password">Mot de passe</label>
              <input id="login_password" name="admin_password_input" autoComplete="new-password" className="w-full border rounded px-3 py-2" type="password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})} required placeholder="" />
            </div>
            <button type="submit" disabled={loginLoading} className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700">Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Super Admin – Gestion des Administrateurs</h1>
          <button onClick={handleLogout} className="px-3 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Se déconnecter</button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom d’utilisateur (optionnel)</label>
            <input className="w-full border rounded px-3 py-2" type="text" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input className="w-full border rounded px-3 py-2" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          </div>
          <div className="flex items-center gap-2">
            <input id="is_super" type="checkbox" checked={form.is_superuser} onChange={e=>setForm({...form,is_superuser:e.target.checked})} />
            <label htmlFor="is_super" className="text-sm">Donner les droits superuser</label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Créer un admin</button>
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-2">Liste des admins</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Superuser</th>
                <th className="p-2 border">Actif</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(admins) && admins.map(a=> (
                <tr key={a.id}>
                  <td className="p-2 border">{a.id}</td>
                  <td className="p-2 border">{a.username}</td>
                  <td className="p-2 border">{a.email}</td>
                  <td className="p-2 border">{a.is_superuser ? 'Oui' : 'Non'}</td>
                  <td className="p-2 border">{a.is_active ? 'Oui' : 'Non'}</td>
                  <td className="p-2 border">
                    <button onClick={()=>handleDelete(a.id)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Supprimer</button>
                  </td>
                </tr>
              ))}
              {admins.length===0 && (
                <tr><td className="p-2 border" colSpan={6}>Aucun admin pour le moment.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPage;
