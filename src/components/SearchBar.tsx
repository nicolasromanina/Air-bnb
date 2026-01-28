import React, { useState } from 'react';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImprovedDatePicker from './ImprovedDatePicker';

interface SearchBarProps {
  variant?: 'hero' | 'default';
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default', className = '' }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [travelers, setTravelers] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!destination.trim()) {
      alert('Veuillez sélectionner une destination');
      return;
    }

    if (!checkIn) {
      alert('Veuillez sélectionner une date d\'arrivée');
      return;
    }

    // Construire les paramètres de recherche
    const searchParams = new URLSearchParams();
    searchParams.set('destination', destination);
    searchParams.set('checkIn', checkIn);
    if (availableFrom) searchParams.set('availableFrom', availableFrom);
    searchParams.set('travelers', travelers);

    // Naviguer vers la page appartement avec les paramètres
    navigate(`/appartement?${searchParams.toString()}`);
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className={`w-full ${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Localisation */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Où souhaitez-vous aller ?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                />
              </div>
            </div>

            {/* Date d'arrivée */}
            <div className="flex flex-col">
              <ImprovedDatePicker
                label="Arrivée"
                value={checkIn}
                onChange={setCheckIn}
                minDate={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Date de disponibilité */}
            <div className="flex flex-col">
              <ImprovedDatePicker
                label="Disponibilité minimum"
                value={availableFrom}
                onChange={setAvailableFrom}
                minDate={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Nombre de voyageurs */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                Voyageurs
              </label>
              <div className="relative">
                <Users size={18} className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'voyageur' : 'voyageurs'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bouton de recherche */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-widest h-full"
              >
                <Search size={18} />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  // Variant default (inline)
  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex-1 relative">
          <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <div className="flex-1 relative">
          <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-pink-500 transition-colors"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex-1 relative">
          <Users size={16} className="absolute left-3 top-3 text-gray-400" />
          <select
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-pink-500 transition-colors appearance-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-md flex items-center gap-2 transition-all text-sm whitespace-nowrap"
        >
          <Search size={16} />
          Rechercher
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
