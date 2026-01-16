import React, { useState } from 'react';

// --- Types ---
type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <div className="font-['Montserrat'] min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center px-4 py-12">
      
      {/* --- LOGO PUISÉ DANS /PUBLIC --- */}
      <div className="mb-10 text-center">
        <img 
          src="/Logo.png" 
          alt="SweetHome Logo" 
          className="h-[40px] w-auto mx-auto object-contain" 
        />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[20px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-50">
        
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-black mb-2">
            {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
          </h1>
          <p className="text-[14px] text-gray-500">
            {mode === 'login' 
              ? 'Veuillez saisir vos identifiants pour accéder à votre espace.' 
              : 'Inscrivez-vous pour commencer à réserver vos appartements.'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {mode === 'register' && (
            <div>
              <label className="block text-[12px] font-bold mb-2 tracking-wide">Nom complet</label>
              <input 
                type="text" 
                placeholder="Votre nom complet" 
                className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
              />
            </div>
          )}

          <div>
            <label className="block text-[12px] font-bold mb-2 tracking-wide">Adresse e-mail</label>
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[12px] font-bold tracking-wide">Mot de passe</label>
              {mode === 'login' && (
                <button type="button" className="text-[11px] text-[#FF2D75] font-semibold hover:underline">
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-[#F3F4F6] p-4 rounded-[8px] outline-none text-[14px] focus:ring-1 focus:ring-[#FF2D75]/20 transition-all" 
            />
          </div>

          {mode === 'register' && (
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 accent-[#FF2D75] cursor-pointer" />
              <label htmlFor="terms" className="text-[11px] text-gray-500 leading-snug cursor-pointer">
                J'accepte les <span className="text-black font-semibold underline">Conditions d'Utilisation</span> et la <span className="text-black font-semibold underline">Politique de Confidentialité</span>.
              </label>
            </div>
          )}

          <button className="w-full bg-[#FF2D75] text-white font-bold py-4 rounded-[8px] text-[15px] hover:bg-[#e62969] transition-all transform active:scale-[0.98] uppercase tracking-wider shadow-lg shadow-[#FF2D75]/20">
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-[14px] text-gray-500">
            {mode === 'login' ? "Vous n'avez pas encore de compte ?" : "Vous avez déjà un compte ?"}
            <button 
              onClick={toggleMode}
              className="ml-2 text-black font-bold hover:text-[#FF2D75] transition-colors"
            >
              {mode === 'login' ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>

      <p className="mt-8 text-[12px] text-gray-400 tracking-widest font-medium">
        © 2024 SweetHome App
      </p>
    </div>
  );
};

export default AuthPage;