import React, { useState } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data?.token) {
        // Verify admin role
        if (res.data?.user?.role === 'superadmin' || res.data?.user?.role === 'admin') {
          toast.push({ title: 'Connexion réussie', description: 'Bienvenue dans l\'admin.' });
          // Redirect to admin dashboard (replace history to prevent going back to login)
          navigate('/admin', { replace: true });
        } else {
          toast.push({ 
            title: 'Accès refusé', 
            description: 'Vous n\'avez pas les droits administrateur.',
            variant: 'destructive'
          });
        }
      } else {
        toast.push({ title: 'Erreur', description: res.error || res.data?.message || 'Échec de la connexion', variant: 'destructive' });
      }
    } catch (err: any) {
      toast.push({ title: 'Erreur', description: err?.message || 'Erreur réseau', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md border rounded p-6 shadow">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Admin Login</h1>

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">Mot de passe</label>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between">
          <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
