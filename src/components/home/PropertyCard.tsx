import { Wifi, Bed, TreePine, Car, Waves, Diamond } from "lucide-react";
import { useState } from "react";

interface PropertyFeature {
  icon: React.ReactNode;
  label: string;
}

interface PropertyCardProps {
  image: string;
  title: string;
  price: number;
  priceUnit: string;
  features: PropertyFeature[];
  description: string;
}

const PropertyCard = ({
  image,
  title,
  price,
  priceUnit,
  features,
  description,
}: PropertyCardProps) => {
  const [buttonHover, setButtonHover] = useState(false);
  const [featureHoverIndex, setFeatureHoverIndex] = useState<number | null>(null);
  const [diamondHover, setDiamondHover] = useState(false);

  return (
    <div 
      className="flex flex-col md:flex-row overflow-hidden rounded-2xl max-w-4xl mx-auto"
      style={{
        backgroundColor: 'hsl(0 0% 6%)',
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Image Section */}
      <div className="md:w-1/2 h-64 md:h-auto">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h2 
            className="text-xl md:text-2xl italic mb-4 leading-tight"
            style={{
              color: 'hsl(0 0% 98%)',
              fontFamily: "'Montserrat', sans-serif",
              fontStyle: 'normal'
            }}
          >
            {title}
          </h2>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span 
              className="text-4xl md:text-5xl font-bold"
              style={{
                color: 'hsl(0 0% 98%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              {price}€
            </span>
            <span 
              className="text-lg"
              style={{
                color: 'hsl(0 0% 65%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              / {priceUnit}
            </span>
          </div>

          {/* CTA Button */}
          <button 
            className="w-full font-medium py-3.5 px-6 rounded-full transition-all duration-300 mb-6"
            style={{
              backgroundColor: buttonHover ? 'hsla(340, 100%, 59%, 0.9)' : 'hsl(340 100% 59%)',
              color: 'hsl(0 0% 100%)',
              borderRadius: '9999px',
              transform: buttonHover ? 'scale(1.02)' : 'scale(1)',
              fontFamily: "'Montserrat', sans-serif"
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            Reserver maintenant
          </button>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  border: `1px solid ${featureHoverIndex === index ? 'hsla(340, 100%, 59%, 0.5)' : 'hsl(0 0% 20%)'}`,
                  color: 'hsl(0 0% 65%)',
                  borderRadius: '9999px',
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onMouseEnter={() => setFeatureHoverIndex(index)}
                onMouseLeave={() => setFeatureHoverIndex(null)}
              >
                {feature.icon}
                {feature.label}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between pt-4"
          style={{
            borderTop: '1px solid hsl(0 0% 20%)'
          }}
        >
          <p 
            className="text-sm"
            style={{
              color: 'hsl(0 0% 65%)',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            {description}
          </p>
          <button 
            className="p-2 rounded-full transition-colors"
            style={{
              border: `1px solid ${diamondHover ? 'hsl(340 100% 59%)' : 'hsl(0 0% 20%)'}`,
              borderRadius: '9999px'
            }}
            onMouseEnter={() => setDiamondHover(true)}
            onMouseLeave={() => setDiamondHover(false)}
          >
            <Diamond 
              className="w-5 h-5 transition-colors"
              style={{
                color: diamondHover ? 'hsl(340 100% 59%)' : 'hsl(0 0% 65%)'
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;