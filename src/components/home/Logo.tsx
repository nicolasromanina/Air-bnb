interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Circle with gradient stroke */}
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(340, 100%, 56%)" />
              <stop offset="100%" stopColor="hsl(340, 100%, 46%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="font-sans font-semibold text-lg tracking-wide">SWEETHOME</span>
    </div>
  );
};

export default Logo;
