import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const [siteName, setSiteName] = useState('Hero Apartments');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [fromEmail, setFromEmail] = useState('no-reply@example.com');
  const toast = useToast();

  useEffect(() => {
    // load from localStorage if available
    try {
      const raw = localStorage.getItem('admin_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        setSiteName(parsed.siteName || siteName);
        setSmtpHost(parsed.smtpHost || '');
        setSmtpPort(parsed.smtpPort || 587);
        setSmtpUser(parsed.smtpUser || '');
        setSmtpPass(parsed.smtpPass || '');
        setFromEmail(parsed.fromEmail || fromEmail);
      }
    } catch (e) {}
  }, []);

  const save = () => {
    const payload = { siteName, smtpHost, smtpPort, smtpUser, smtpPass, fromEmail };
    localStorage.setItem('admin_settings', JSON.stringify(payload));
    toast.push({ title: 'Paramètres sauvegardés', description: 'Les paramètres ont été enregistrés localement.' });
  };

  return (
    <div className="bg-white rounded shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Paramètres</h2>
        <p className="text-sm text-gray-600">Configuration de l'application et préférences admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <label className="block text-sm font-medium mb-1">Nom du site</label>
          <input className="w-full p-2 border rounded" value={siteName} onChange={e => setSiteName(e.target.value)} />
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <label className="block text-sm font-medium mb-1">Adresse email d'envoi</label>
          <input className="w-full p-2 border rounded" value={fromEmail} onChange={e => setFromEmail(e.target.value)} />
        </div>
      </div>

      <div className="bg-white p-4 border rounded">
        <h3 className="font-semibold mb-3">SMTP / Email</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="p-2 border rounded" placeholder="SMTP Host" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} />
          <input className="p-2 border rounded" type="number" placeholder="Port" value={smtpPort} onChange={e => setSmtpPort(Number(e.target.value))} />
          <input className="p-2 border rounded" placeholder="Username" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
        </div>
        <div className="mt-3">
          <input className="p-2 border rounded w-full" placeholder="Password" type="password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button onClick={save} className="px-4 py-2 bg-pink-600 text-white rounded">Enregistrer</button>
      </div>
    </div>
  );
};

export default SettingsPage;
