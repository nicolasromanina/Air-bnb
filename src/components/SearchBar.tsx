import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { MapPin, Calendar, Users, Search, ArrowRight, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImprovedDatePicker from './ImprovedDatePicker';
import DESTINATIONS from '@/data/destinations';

interface SearchBarProps {
  variant?: 'hero' | 'default';
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default', className = '' }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Construire les paramètres de recherche
    const searchParams = new URLSearchParams();
    searchParams.set('destination', destination);
    searchParams.set('checkIn', checkIn);
    if (availableFrom) searchParams.set('availableFrom', availableFrom);
    searchParams.set('travelers', travelers);

    // Naviguer vers la page appartement avec les paramètres
    navigate(`/appartement?${searchParams.toString()}`);
  };

  const filterSuggestions = (value: string) => {
    if (!value) return [];
    const q = value.trim().toLowerCase();
    // Prioritise exact startsWith, then includes
    const starts = DESTINATIONS.filter((d) => d.toLowerCase().startsWith(q));
    const includes = DESTINATIONS.filter((d) => !d.toLowerCase().startsWith(q) && d.toLowerCase().includes(q));
    return [...starts, ...includes].slice(0, 6);
  };

  const handleInputChange = (value: string) => {
    setDestination(value);
    setActiveIndex(-1);
    // suggestions are computed with debounce in effect below
  };

  // Debounce suggestions for better UX & perf
  useEffect(() => {
    if (!destination) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const id = setTimeout(() => {
      const results = filterSuggestions(destination);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setActiveIndex(-1);
      setIsLoadingSuggestions(false);
    }, 250);

    return () => clearTimeout(id);
  }, [destination]);

  const selectSuggestion = (value: string) => {
    setDestination(value);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const q = query.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-semibold">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(ev.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className={`w-full ${className}`}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 max-w-6xl mx-auto border border-gray-50">
          {/* Grille responsive améliorée */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 mb-6">
            
            {/* Localisation */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3 pl-1">
                Destination
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'destination' ? 'transform scale-105' : ''}`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" 
                     style={{ color: focusedField === 'destination' ? '#FF1B7C' : '#999' }}>
                  <MapPin size={18} strokeWidth={2.5} />
                </div>
                <div ref={containerRef} className="relative">
                  <input
                    type="text"
                    placeholder="Où souhaitez-vous aller ?"
                    value={destination}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => { setFocusedField('destination'); if (suggestions.length) setShowSuggestions(true); }}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                    aria-haspopup="listbox"
                    className={`w-full pl-10 pr-10 py-3.5 border-2 rounded-xl font-medium transition-all duration-300 placeholder-gray-400
                      ${focusedField === 'destination' 
                        ? 'border-pink-500 bg-pink-50/30 shadow-lg' 
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                      }
                      focus:outline-none`}
                  />
                  {destination && (
                    <button type="button" onClick={() => handleInputChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      <X size={16} />
                    </button>
                  )}

                  {showSuggestions && (
                    <ul role="listbox" aria-label="Suggestions de destinations" className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-56 overflow-auto text-sm">
                      {isLoadingSuggestions && (
                        <li className="px-4 py-2 text-gray-500 flex items-center gap-2">
                          <Loader2 className="animate-spin" size={14} /> Chargement...
                        </li>
                      )}
                      {!isLoadingSuggestions && suggestions.length === 0 && (
                        <li className="px-4 py-2 text-gray-500">Aucune suggestion trouvée</li>
                      )}
                      {suggestions.map((s, idx) => (
                        <li
                          key={s}
                          role="option"
                          aria-selected={activeIndex === idx}
                          onMouseDown={(ev) => ev.preventDefault()}
                          onClick={() => selectSuggestion(s)}
                          className={`px-4 py-2 cursor-pointer hover:bg-pink-50 ${activeIndex === idx ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-gray-700'}`}
                        >
                          {highlightMatch(s, destination)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Date d'arrivée */}
            <div className="flex flex-col">
              <div
                onFocus={() => setFocusedField('checkIn')}
                onBlur={() => setFocusedField(null)}
              >
                <ImprovedDatePicker
                  label="Arrivée"
                  value={checkIn}
                  onChange={setCheckIn}
                  minDate={new Date().toISOString().split('T')[0]}
                  focused={focusedField === 'checkIn'}
                  setFocused={() => setFocusedField('checkIn')}
                  setUnfocused={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Date de disponibilité */}
            <div className="flex flex-col">
              <div
                onFocus={() => setFocusedField('availableFrom')}
                onBlur={() => setFocusedField(null)}
              >
                <ImprovedDatePicker
                  label="Disponibilité minimum"
                  value={availableFrom}
                  onChange={setAvailableFrom}
                  minDate={new Date().toISOString().split('T')[0]}
                  focused={focusedField === 'availableFrom'}
                  setFocused={() => setFocusedField('availableFrom')}
                  setUnfocused={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Nombre de voyageurs */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3 pl-1">
                Voyageurs
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'travelers' ? 'transform scale-105' : ''}`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300" 
                     style={{ color: focusedField === 'travelers' ? '#FF1B7C' : '#999' }}>
                  <Users size={18} strokeWidth={2.5} />
                </div>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  onFocus={() => setFocusedField('travelers')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl font-medium transition-all duration-300 appearance-none cursor-pointer
                    ${focusedField === 'travelers' 
                      ? 'border-pink-500 bg-pink-50/30 shadow-lg' 
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                    }
                    focus:outline-none`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '32px'
                  }}
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
                className="w-full bg-gradient-to-r from-[#FF1B7C] to-[#FF4B9D] hover:from-[#FF4B9D] hover:to-[#FF6BB5] text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider text-sm font-montserrat h-full group"
              >
                <Search size={18} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline group-hover:translate-x-1 transition-transform">Rechercher</span>
              </button>
            </div>
          </div>

          {/* Note d'aide */}
          <div className="text-center text-xs text-gray-500">
            Remplissez tous les champs pour trouver votre destination idéale
          </div>
        </div>
      </form>
    );
  }

  // Variant default (inline) - Amélioré
  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 items-center bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        {/* Destination */}
        <div className={`flex-1 relative transition-all duration-300 ${focusedField === 'destination' ? 'ring-2 ring-pink-300 rounded-lg' : ''}`}>
          <MapPin size={16} className={`absolute left-3 top-3 transition-colors ${focusedField === 'destination' ? 'text-pink-500' : 'text-gray-400'}`} />
          <div ref={containerRef} className="relative">
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => { setFocusedField('destination'); if (suggestions.length) setShowSuggestions(true); }}
              onBlur={() => setFocusedField(null)}
              onKeyDown={handleKeyDown}
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-pink-500 transition-colors hover:border-gray-400"
            />
            {destination && (
              <button type="button" onClick={() => handleInputChange('')} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
                <X size={14} />
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <ul role="listbox" className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-56 overflow-auto text-sm">
                {suggestions.map((s, idx) => (
                  <li
                    key={s}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => selectSuggestion(s)}
                    className={`px-4 py-2 cursor-pointer hover:bg-pink-50 ${activeIndex === idx ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-gray-700'}`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Check-in Date */}
        <div className={`flex-1 relative transition-all duration-300 ${focusedField === 'checkIn' ? 'ring-2 ring-pink-300 rounded-lg' : ''}`}>
          <Calendar size={16} className={`absolute left-3 top-3 transition-colors ${focusedField === 'checkIn' ? 'text-pink-500' : 'text-gray-400'}`} />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            onFocus={() => setFocusedField('checkIn')}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-pink-500 transition-colors hover:border-gray-400"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Travelers */}
        <div className={`flex-1 relative transition-all duration-300 ${focusedField === 'travelers' ? 'ring-2 ring-pink-300 rounded-lg' : ''}`}>
          <Users size={16} className={`absolute left-3 top-3 transition-colors ${focusedField === 'travelers' ? 'text-pink-500' : 'text-gray-400'}`} />
          <select
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            onFocus={() => setFocusedField('travelers')}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-pink-500 transition-colors hover:border-gray-400 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              paddingRight: '28px'
            }}
          >
            <option value="">Voyageurs</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? 'voyageur' : 'voyageurs'}</option>
            ))}
          </select>
        </div>

        {/* Bouton Recherche */}
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all text-sm whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group"
        >
          <Search size={16} className="transition-transform group-hover:scale-110" />
          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity group-hover:-translate-x-1" />
          Rechercher
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
