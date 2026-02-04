import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '@/utils/auth';
import { api } from '@/services/api';

export default function GeneralCondition() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await api.get('/cms/general-conditions');
      if (response.success && response.data?.page) {
        setContent(response.data.page);
      } else {
        console.error('Failed to load general conditions page:', response.error);
      }
    } catch (err) {
      console.error('Failed to load general conditions page:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Conditions Générales</h1>
          {isAdmin() && (
            <button
              onClick={() => navigate('/admin/general-conditions-editor')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Éditer
            </button>
          )}
        </div>

        <div className="prose prose-lg max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content.html || content }} />
          ) : (
            <p className="text-gray-600">Aucun contenu disponible</p>
          )}
        </div>
      </div>
    </div>
  );
}
