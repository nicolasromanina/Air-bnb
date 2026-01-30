import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface PromoData {
  title?: string;
  description?: string;
  image?: string;
  cardImage?: string;
  badge?: {
    label: string;
    color: string;
  };
  features?: Array<{ text: string; icon?: string }>;
  bottomMessage?: string;
  isActive?: boolean;
}

interface PromSectionProps {
  promo?: PromoData;
}

const PromoSection = ({ promo }: PromSectionProps) => {
  // Valeurs par défaut
  const data = promo || {
    title: 'Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    badge: {
      label: 'Option Premium',
      color: '#10b981'
    },
    features: [
      { text: 'Rorem ipsum dolor sit amet,' },
      { text: 'consectetur adipiscing elit' }
    ],
    bottomMessage: 'Cette option premium est automatiquement incluse dans votre réservation. Aucun coût supplémentaire.',
    isActive: true
  };

  console.log('[PROMO SECTION] Rendering with data:', {
    hasPromo: !!promo,
    title: data.title,
    hasImage: !!data.image,
    hasCardImage: !!data.cardImage,
    isActive: data.isActive,
    features: data.features?.length || 0
  });

  // Only hide if explicitly set to false. If undefined or null, show it (default to visible)
  if (data.isActive === false) {
    console.log('[PROMO SECTION] ❌ Hidden because isActive === false');
    return null;
  }

  console.log('[PROMO SECTION] ✅ Showing promotion section');

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="max-w-[1140px] mx-auto px-6 py-20"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <img
            src={data.image}
            alt="Promotion"
            className="w-full h-[400px] md:h-[500px] object-cover rounded-xl shadow-lg"
          />
        </motion.div>

        {/* Right Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {data.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Promo Card */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-sm border border-gray-100"
          >
            {/* Badge and Image */}
            <div className="relative">
              {data.badge && (
                <div 
                  className="absolute top-4 left-4 rounded-full px-4 py-2 z-10 shadow-lg"
                  style={{ backgroundColor: data.badge.color }}
                >
                  <p className="text-xs font-bold text-white tracking-wide">
                    {data.badge.label}
                  </p>
                </div>
              )}
              <img
                src={data.cardImage || data.image}
                alt="Promo Card"
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Features */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-3 mb-4">
                {data.features && data.features.length > 0 ? (
                  data.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <Star size={14} className="text-yellow-500 flex-shrink-0" />
                      <p className="text-sm text-gray-700 font-medium">
                        {feature.text}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">Caractéristiques premium incluses</p>
                )}
              </div>

              {/* Bottom Message */}
              {data.bottomMessage && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-gray-500 font-medium leading-relaxed pt-4 border-t border-gray-200"
                >
                  ✓ {data.bottomMessage}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PromoSection;
