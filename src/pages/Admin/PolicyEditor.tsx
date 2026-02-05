import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import RichTextEditor from '../../components/RichTextEditor';

export default function PolicyEditor() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadContent();
    loadHistory();
  }, []);

  const loadContent = async () => {
    try {
      const response = await api.getCmsPage('policy');
      if (response.success && response.data) {
        const pageData = response.data.page || response.data;
        setContent(pageData?.html || '');
      }
    } catch (err) {
      console.error('Failed to load policy page:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await api.getCmsPageHistory('policy');
      if (response.success && response.data) {
        const historyData = response.data.history || response.data;
        setHistory(Array.isArray(historyData) ? historyData : []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.updateCmsPage('policy', content);
      if (response.success) {
        setMessage('✓ Sauvegardé avec succès');
        loadHistory();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('✗ Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Failed to save:', err);
      setMessage('✗ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (snapshotId: number) => {
    try {
      const response = await api.restoreCmsPage('policy', snapshotId);
      if (response.success && response.data) {
        const pageData = response.data.page || response.data;
        setContent(pageData?.html || content);
        setMessage('✓ Version restaurée');
        loadHistory();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to restore:', err);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Éditer Politique de Confidentialité</h1>
          <button
            onClick={() => navigate('/policy')}
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Retour
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <RichTextEditor
                value={content}
                onChange={setContent}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Historique</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun historique</p>
              ) : (
                history.map((snap) => (
                  <div key={snap.id} className="border-l-2 border-gray-300 pl-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(snap.at).toLocaleString('fr-FR')}
                    </p>
                    <button
                      onClick={() => handleRestore(snap.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    >
                      Restaurer cette version
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
