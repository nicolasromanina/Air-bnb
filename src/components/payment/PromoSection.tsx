import { useState } from "react";
import bedroomPromo from "@/assets/bedroom-promo.jpg";
import promoCard from "@/assets/promo-card.jpg";

const PromoSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Image - Amélioré avec effet de zoom et skeleton */}
        <div className="relative group overflow-hidden rounded-xl">
          <div 
            className={`absolute inset-0 bg-gray-100 animate-pulse rounded-xl ${
              imageLoaded ? "hidden" : "block"
            }`}
          />
          <img
            src={bedroomPromo}
            alt="Chambre de luxe"
            className={`w-full h-[350px] md:h-[450px] object-cover rounded-xl transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          {/* Indicateur de chargement subtil */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Right Content - Optimisé pour page de paiement */}
        <div className="space-y-8">
          {/* En-tête avec badge de confiance */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Option Premium
              </div>
              <div className="text-xs text-muted-foreground">
                Incluse dans votre réservation
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed">
                <span className="font-bold text-lg md:text-xl">
                  Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </span>{" "}
                <span className="text-muted-foreground">
                  Class aptent taciti sociosqu ad
                </span>{" "}
                <span className="font-bold">
                  litora torquent per conubia nostra, per inceptos himenaeos.
                </span>
              </p>
            </div>
          </div>

          {/* Promo Card - Version simplifiée pour paiement */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg z-10">
                <p className="text-xs font-bold tracking-wide">Inclus</p>
                <p className="text-xs font-semibold text-gray-200">avec séjour</p>
              </div>
              
              {/* Badge de valeur */}
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white leading-tight">+Valeur</span>
                  <span className="text-[10px] text-amber-100">ajoutée</span>
                </div>
              </div>

              <img
                src={promoCard}
                alt="Service promotionnel inclus"
                className="w-full h-40 object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="p-5 bg-gray-50 space-y-3 border-t border-gray-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-sm text-gray-700 font-medium">
                    Rorem ipsum dolor sit amet,
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-sm text-gray-700">
                    consectetur adipiscing elit
                  </p>
                </div>
              </div>
              
              {/* Indicateurs de qualité */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="w-2 h-2 rounded-full bg-amber-400"
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">Premium</span>
                </div>
                
                {/* Indicateur visuel de confirmation */}
                <div className="flex items-center gap-1.5 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Confirmé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message rassurant pour paiement */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-blue-700">
              Cette option premium est automatiquement incluse dans votre réservation. Aucun coût supplémentaire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;