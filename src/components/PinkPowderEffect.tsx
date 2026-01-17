import "./PinkPowderEffect.css";

const PARTICLES_COUNT = 30;

const PinkPowderEffect: React.FC = () => {
  return (
    <div className="pink-powder-container">
      {Array.from({ length: PARTICLES_COUNT }).map((_, i) => {
        const size = Math.random() * 12 + 6;

        return (
          <span
            key={i}
            className="pink-powder-particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${Math.random() * 6 + 8}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default PinkPowderEffect;
