import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  posterImage?: string;
  alt?: string;
  className?: string;
  playButtonSize?: 'small' | 'medium' | 'large';
  onPlayClick?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  posterImage,
  alt = 'Video player',
  className = '',
  playButtonSize = 'medium',
  onPlayClick
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (!videoUrl) {
    return null;
  }

  const handlePlayClick = () => {
    onPlayClick?.();
    setIsVideoOpen(true);
  };

  const playButtonSizes = {
    small: { button: 'w-10 h-10', icon: 'w-4 h-4' },
    medium: { button: 'w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20', icon: 'w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7' },
    large: { button: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24', icon: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' }
  };

  const sizes = playButtonSizes[playButtonSize];

  return (
    <>
      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] mx-4">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Fermer la vidéo"
            >
              <X size={32} />
            </button>
            
            <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                style={{ maxHeight: '90vh' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      <button
        onClick={handlePlayClick}
        className={`absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all duration-300 rounded-inherit group`}
        aria-label="Lire la vidéo"
      >
        <div className={`${sizes.button} rounded-full border-2 border-white/40 flex items-center justify-center backdrop-blur-md bg-white/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#FF1B7C] group-hover:border-[#FF1B7C]`}>
          <Play className={`${sizes.icon} text-white fill-white ml-0.5`} />
        </div>
      </button>
    </>
  );
};

export default VideoPlayer;
