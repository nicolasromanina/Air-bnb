import React, { useRef, useState } from 'react';
import { Upload, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

type Props = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
};

const VideoUploader: React.FC<Props> = ({ value, onChange, label = 'Upload vidéo' }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleVideoUpload = async (file?: File) => {
    if (!file) return;

    // Validation du type
    if (!file.type.startsWith('video/')) {
      setUploadError('Veuillez sélectionner un fichier vidéo valide');
      return;
    }

    // Validation de la taille (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setUploadError('Le fichier dépasse 100MB. Veuillez utiliser une vidéo plus petite.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('video', file);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://airbnb-backend.onrender.com/api';
      
      const response = await fetch(
        `${apiUrl}/home/upload-video`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      const videoUrl = data.url;

      setPreview(videoUrl);
      onChange(videoUrl);
      setUploadSuccess(true);
      
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur upload vidéo:', error);
      setUploadError(error instanceof Error ? error.message : 'Erreur lors de l\'upload. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(undefined);
    onChange('');
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      
      <div className="space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={(e) => handleVideoUpload(e.target.files?.[0])}
          disabled={isUploading}
        />

        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload size={18} />
            {isUploading ? 'Upload en cours...' : 'Télécharger vidéo'}
          </button>

          {preview && (
            <button
              onClick={handleClear}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              <Trash2 size={18} />
              Supprimer
            </button>
          )}
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={18} />
            <span className="text-sm">{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle size={18} />
            <span className="text-sm">Vidéo uploadée avec succès!</span>
          </div>
        )}

        {preview && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">URL générée:</p>
            <div className="p-3 bg-gray-50 rounded-lg break-all">
              <code className="text-xs text-gray-700">{preview}</code>
            </div>
            <video
              src={preview}
              controls
              className="w-full h-40 bg-black rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
