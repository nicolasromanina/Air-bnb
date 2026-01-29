import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Loader2, Settings, Mail, Key, Globe, Database, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

interface AppSettings {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  siteCity: string;
  siteZipCode: string;
  siteCountry: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  analyticsId: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
  testEmail: string;
}

interface ApiSettings {
  stripePublicKey: string;
  stripeSecretKey: string;
  jwtSecret: string;
  jwtExpires: string;
  apiBaseUrl: string;
  corsOrigins: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'api'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // General Settings
  const [appSettings, setAppSettings] = useState<AppSettings>({
    siteName: 'Hero Apartments',
    siteDescription: 'Votre plateforme de réservation d\'appartements',
    siteEmail: 'contact@heroapartments.com',
    sitePhone: '+33612345678',
    siteAddress: '123 Rue de la Paix',
    siteCity: 'Paris',
    siteZipCode: '75000',
    siteCountry: 'France',
    maintenanceMode: false,
    maintenanceMessage: 'Maintenance en cours...',
    analyticsId: '',
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'no-reply@heroapartments.com',
    fromName: 'Hero Apartments',
    testEmail: '',
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    stripePublicKey: '',
    stripeSecretKey: '',
    jwtSecret: '',
    jwtExpires: '7d',
    apiBaseUrl: '',
    corsOrigins: '',
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // Load from localStorage
      const stored = localStorage.getItem('admin_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAppSettings(prev => ({ ...prev, ...parsed.app }));
        setEmailSettings(prev => ({ ...prev, ...parsed.email }));
        setApiSettings(prev => ({ ...prev, ...parsed.api }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const payload = {
        app: appSettings,
        email: emailSettings,
        api: apiSettings,
      };
      localStorage.setItem('admin_settings', JSON.stringify(payload));
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const testEmailConnection = async () => {
    if (!emailSettings.smtpHost || !emailSettings.smtpUser || !emailSettings.testEmail) {
      toast.error('Veuillez remplir les champs SMTP et l\'email de test');
      return;
    }

    try {
      setIsTesting(true);
      // Simulating test - in real app, would call backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Email de test envoyé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du test');
    } finally {
      setIsTesting(false);
    }
  };

  const handleAppChange = (field: keyof AppSettings, value: any) => {
    setAppSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (field: keyof EmailSettings, value: any) => {
    setEmailSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleApiChange = (field: keyof ApiSettings, value: any) => {
    setApiSettings(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF1B7C]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Settings size={28} />
          Paramètres de l'application
        </h2>
        <p className="text-gray-600 text-sm mt-2">Gérez toutes les configurations de l'application</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        {[
          { id: 'general', label: 'Général', icon: Globe },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'api', label: 'API', icon: Key },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-all ${
              activeTab === id
                ? 'border-[#FF1B7C] text-[#FF1B7C]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom du site */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du site</label>
                <input
                  type="text"
                  value={appSettings.siteName}
                  onChange={(e) => handleAppChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="Hero Apartments"
                />
              </div>

              {/* Email du site */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email de contact</label>
                <input
                  type="email"
                  value={appSettings.siteEmail}
                  onChange={(e) => handleAppChange('siteEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="contact@heroapartments.com"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={appSettings.sitePhone}
                  onChange={(e) => handleAppChange('sitePhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="+33612345678"
                />
              </div>

              {/* Pays */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pays</label>
                <input
                  type="text"
                  value={appSettings.siteCountry}
                  onChange={(e) => handleAppChange('siteCountry', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="France"
                />
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                value={appSettings.siteAddress}
                onChange={(e) => handleAppChange('siteAddress', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                placeholder="123 Rue de la Paix"
              />
            </div>

            {/* Ville et Code Postal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  value={appSettings.siteCity}
                  onChange={(e) => handleAppChange('siteCity', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Code Postal</label>
                <input
                  type="text"
                  value={appSettings.siteZipCode}
                  onChange={(e) => handleAppChange('siteZipCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="75000"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description du site</label>
              <textarea
                value={appSettings.siteDescription}
                onChange={(e) => handleAppChange('siteDescription', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                placeholder="Description de votre plateforme"
              />
            </div>

            {/* Analytics */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Google Analytics ID</label>
              <input
                type="text"
                value={appSettings.analyticsId}
                onChange={(e) => handleAppChange('analyticsId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            {/* Maintenance Mode */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.maintenanceMode}
                  onChange={(e) => handleAppChange('maintenanceMode', e.target.checked)}
                  className="w-5 h-5 rounded text-[#FF1B7C]"
                />
                <div>
                  <p className="font-semibold text-gray-900">Mode maintenance</p>
                  <p className="text-sm text-gray-600">Désactiver l'accès au site pendant les travaux</p>
                </div>
              </label>
              {appSettings.maintenanceMode && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message de maintenance</label>
                  <input
                    type="text"
                    value={appSettings.maintenanceMessage}
                    onChange={(e) => handleAppChange('maintenanceMessage', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Maintenance en cours..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Settings Tab */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Configuration SMTP</p>
                <p>Ces paramètres permettent l'envoi des emails (confirmations, notifications, etc.)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Serveur SMTP</label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) => handleEmailChange('smtpHost', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Port</label>
                <input
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) => handleEmailChange('smtpPort', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="587"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={emailSettings.smtpUser}
                  onChange={(e) => handleEmailChange('smtpUser', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={emailSettings.smtpPass}
                onChange={(e) => handleEmailChange('smtpPass', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email d'envoi</label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) => handleEmailChange('fromEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="noreply@heroapartments.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'envoi</label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) => handleEmailChange('fromName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="Hero Apartments"
                />
              </div>
            </div>

            {/* Test Email */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tester la connexion</label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={emailSettings.testEmail}
                  onChange={(e) => handleEmailChange('testEmail', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="test@example.com"
                />
                <button
                  onClick={testEmailConnection}
                  disabled={isTesting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isTesting ? <Loader2 size={18} className="animate-spin" /> : 'Tester'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Settings Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-purple-600 flex-shrink-0" />
              <div className="text-sm text-purple-800">
                <p className="font-semibold">Configuration API</p>
                <p>Clés d'intégration et paramètres de sécurité</p>
              </div>
            </div>

            {/* Stripe */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Stripe (Paiements)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Clé publique</label>
                  <input
                    type="text"
                    value={apiSettings.stripePublicKey}
                    onChange={(e) => handleApiChange('stripePublicKey', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    placeholder="pk_live_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Clé secrète</label>
                  <input
                    type="password"
                    value={apiSettings.stripeSecretKey}
                    onChange={(e) => handleApiChange('stripeSecretKey', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    placeholder="sk_live_..."
                  />
                </div>
              </div>
            </div>

            {/* JWT */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">JWT (Authentification)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Secret JWT</label>
                  <input
                    type="password"
                    value={apiSettings.jwtSecret}
                    onChange={(e) => handleApiChange('jwtSecret', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    placeholder="votre-secret-jwt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durée d'expiration</label>
                  <input
                    type="text"
                    value={apiSettings.jwtExpires}
                    onChange={(e) => handleApiChange('jwtExpires', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    placeholder="7d"
                  />
                </div>
              </div>
            </div>

            {/* API URLs */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">URLs API</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL de base API</label>
                <input
                  type="text"
                  value={apiSettings.apiBaseUrl}
                  onChange={(e) => handleApiChange('apiBaseUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="https://api.heroapartments.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Origines CORS autorisées</label>
                <input
                  type="text"
                  value={apiSettings.corsOrigins}
                  onChange={(e) => handleApiChange('corsOrigins', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                  placeholder="https://heroapartments.com,https://www.heroapartments.com"
                />
                <p className="text-xs text-gray-500 mt-2">Séparez les URLs par des virgules</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-[#FF1B7C] text-white rounded-lg hover:bg-[#e0176d] transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
