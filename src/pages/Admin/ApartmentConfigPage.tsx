import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Save, Loader2, Settings, Plus, Trash2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ApartmentConfig {
  destinations: string[];
  maxTravelers: number;
  minTravelers: number;
  maxPrice: number;
  minPrice: number;
  maxGuests: number;
  defaultLoadMoreCount: number;
  searchFiltersEnabled: boolean;
  destinationSuggestionsEnabled: boolean;
  popularDestinations: string[];
  apartmentDisplayOptions: {
    showUnavailableApartments: boolean;
    defaultSortBy: 'name' | 'price' | 'capacity';
    itemsPerPage: number;
  };
  validationSettings: {
    requireDestination: boolean;
    requireCheckInDate: boolean;
    requireTravelers: boolean;
    allowFutureBookingsOnly: boolean;
  };
}

const ApartmentConfigPage: React.FC = () => {
  const [config, setConfig] = useState<ApartmentConfig>({
    destinations: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Lille', 'Strasbourg'],
    maxTravelers: 20,
    minTravelers: 1,
    maxPrice: 5000,
    minPrice: 100,
    maxGuests: 10,
    defaultLoadMoreCount: 6,
    searchFiltersEnabled: true,
    destinationSuggestionsEnabled: true,
    popularDestinations: ['Paris', 'Lyon', 'Marseille'],
    apartmentDisplayOptions: {
      showUnavailableApartments: false,
      defaultSortBy: 'name',
      itemsPerPage: 12,
    },
    validationSettings: {
      requireDestination: true,
      requireCheckInDate: true,
      requireTravelers: true,
      allowFutureBookingsOnly: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDestination, setNewDestination] = useState('');
  const [newPopularDestination, setNewPopularDestination] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'destinations' | 'display' | 'validation'>('general');

  // Load config from localStorage on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const saved = localStorage.getItem('apartment_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          setConfig(parsed);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error('Erreur lors du chargement de la configuration');
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  const saveConfig = async () => {
    try {
      setIsSaving(true);
      localStorage.setItem('apartment_config', JSON.stringify(config));
      
      // Dispatch un événement custom pour notifier l'app
      window.dispatchEvent(new CustomEvent('apartment_config_updated', { detail: config }));
      
      toast.success('Configuration sauvegardée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const resetConfig = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser la configuration?')) {
      localStorage.removeItem('apartment_config');
      window.location.reload();
    }
  };

  const addDestination = () => {
    if (newDestination.trim()) {
      if (!config.destinations.includes(newDestination)) {
        setConfig(prev => ({
          ...prev,
          destinations: [...prev.destinations, newDestination]
        }));
        setNewDestination('');
        toast.success(`${newDestination} ajouté aux destinations`);
      } else {
        toast.error('Cette destination existe déjà');
      }
    }
  };

  const removeDestination = (destination: string) => {
    setConfig(prev => ({
      ...prev,
      destinations: prev.destinations.filter(d => d !== destination),
      popularDestinations: prev.popularDestinations.filter(d => d !== destination)
    }));
    toast.success(`${destination} supprimée`);
  };

  const addPopularDestination = () => {
    if (newPopularDestination.trim()) {
      if (config.destinations.includes(newPopularDestination)) {
        if (!config.popularDestinations.includes(newPopularDestination)) {
          setConfig(prev => ({
            ...prev,
            popularDestinations: [...prev.popularDestinations, newPopularDestination]
          }));
          setNewPopularDestination('');
          toast.success(`${newPopularDestination} ajouté aux destinations populaires`);
        } else {
          toast.error('Cette destination est déjà populaire');
        }
      } else {
        toast.error('Veuillez d\'abord ajouter cette destination à la liste principale');
      }
    }
  };

  const removePopularDestination = (destination: string) => {
    setConfig(prev => ({
      ...prev,
      popularDestinations: prev.popularDestinations.filter(d => d !== destination)
    }));
    toast.success(`${destination} retiré des destinations populaires`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF1B7C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Configuration des Appartements" subtitle="Gérez tous les paramètres de recherche et d'affichage" />

      <div className="p-6 space-y-6">
        {/* Status Bar */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Configuration Centralisée</h3>
            <p className="text-sm text-blue-800">Ces paramètres affectent directement le comportement de la page de recherche et d'affichage des appartements.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            {[
              { id: 'general', label: 'Paramètres Généraux', icon: Settings },
              { id: 'destinations', label: 'Destinations', icon: 'globe' },
              { id: 'display', label: 'Affichage', icon: 'eye' },
              { id: 'validation', label: 'Validation', icon: 'check' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 px-6 py-4 font-medium border-b-2 transition-all text-center ${
                  activeTab === id
                    ? 'border-[#FF1B7C] text-[#FF1B7C] bg-[#FF1B7C]/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Min Travelers */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre minimum de voyageurs
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.minTravelers}
                      onChange={(e) => setConfig(prev => ({ ...prev, minTravelers: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Max Travelers */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre maximum de voyageurs
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.maxTravelers}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxTravelers: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prix minimum (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={config.minPrice}
                      onChange={(e) => setConfig(prev => ({ ...prev, minPrice: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prix maximum (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={config.maxPrice}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Max Guests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre maximum de lits
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.maxGuests}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxGuests: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Default Load More Count */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre d'appartements par chargement
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.defaultLoadMoreCount}
                      onChange={(e) => setConfig(prev => ({ ...prev, defaultLoadMoreCount: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Filtres de recherche activés
                    </label>
                    <input
                      type="checkbox"
                      checked={config.searchFiltersEnabled}
                      onChange={(e) => setConfig(prev => ({ ...prev, searchFiltersEnabled: e.target.checked }))}
                      className="w-4 h-4 text-[#FF1B7C] rounded focus:ring-2 focus:ring-[#FF1B7C]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Suggestions de destinations activées
                    </label>
                    <input
                      type="checkbox"
                      checked={config.destinationSuggestionsEnabled}
                      onChange={(e) => setConfig(prev => ({ ...prev, destinationSuggestionsEnabled: e.target.checked }))}
                      className="w-4 h-4 text-[#FF1B7C] rounded focus:ring-2 focus:ring-[#FF1B7C]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DESTINATIONS TAB */}
            {activeTab === 'destinations' && (
              <div className="space-y-6">
                {/* Add Destination */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Ajouter une destination</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nom de la destination"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addDestination()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                    <button
                      onClick={addDestination}
                      className="px-4 py-2 bg-[#FF1B7C] text-white rounded-lg font-medium hover:bg-[#FF1B7C]/90 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Destinations List */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Destinations ({config.destinations.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {config.destinations.map((dest) => (
                      <div
                        key={dest}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">{dest}</span>
                        <button
                          onClick={() => removeDestination(dest)}
                          className="p-1.5 hover:bg-red-100 rounded transition-colors text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Destinations */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Destinations Populaires</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <p className="text-sm text-gray-600 mb-4">Sélectionnez les destinations à promouvoir</p>
                    <div className="flex gap-2">
                      <select
                        value={newPopularDestination}
                        onChange={(e) => setNewPopularDestination(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      >
                        <option value="">Sélectionner une destination</option>
                        {config.destinations
                          .filter(d => !config.popularDestinations.includes(d))
                          .map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                      </select>
                      <button
                        onClick={addPopularDestination}
                        disabled={!newPopularDestination}
                        className="px-4 py-2 bg-[#FF1B7C] text-white rounded-lg font-medium hover:bg-[#FF1B7C]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Ajouter
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {config.popularDestinations.map((dest) => (
                      <div
                        key={dest}
                        className="flex items-center justify-between p-3 bg-[#FF1B7C]/10 border border-[#FF1B7C]/20 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">⭐ {dest}</span>
                        <button
                          onClick={() => removePopularDestination(dest)}
                          className="p-1.5 hover:bg-red-100 rounded transition-colors text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DISPLAY TAB */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Default Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tri par défaut
                    </label>
                    <select
                      value={config.apartmentDisplayOptions.defaultSortBy}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apartmentDisplayOptions: {
                          ...prev.apartmentDisplayOptions,
                          defaultSortBy: e.target.value as any
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    >
                      <option value="name">Nom</option>
                      <option value="price">Prix</option>
                      <option value="capacity">Capacité</option>
                    </select>
                  </div>

                  {/* Items Per Page */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Éléments par page
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.apartmentDisplayOptions.itemsPerPage}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apartmentDisplayOptions: {
                          ...prev.apartmentDisplayOptions,
                          itemsPerPage: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Display Toggles */}
                <div className="space-y-3 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Afficher les appartements indisponibles
                    </label>
                    <input
                      type="checkbox"
                      checked={config.apartmentDisplayOptions.showUnavailableApartments}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apartmentDisplayOptions: {
                          ...prev.apartmentDisplayOptions,
                          showUnavailableApartments: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-[#FF1B7C] rounded focus:ring-2 focus:ring-[#FF1B7C]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VALIDATION TAB */}
            {activeTab === 'validation' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-amber-800">Configurez les règles de validation du formulaire de recherche</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="text-sm font-semibold text-gray-700">
                      La destination est obligatoire
                    </label>
                    <input
                      type="checkbox"
                      checked={config.validationSettings.requireDestination}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        validationSettings: {
                          ...prev.validationSettings,
                          requireDestination: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-[#FF1B7C] rounded focus:ring-2 focus:ring-[#FF1B7C]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="text-sm font-semibold text-gray-700">
                      La date d'arrivée est obligatoire
                    </label>
                    <input
                      type="checkbox"
                      checked={config.validationSettings.requireCheckInDate}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        validationSettings: {
                          ...prev.validationSettings,
                          requireCheckInDate: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-[#FF1B7C] rounded focus:ring-2 focus:ring-[#FF1B7C]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="text-sm font-semibold text-gray-700">
                      Le nombre de voyageurs est obligatoire
                    </label>
                    <input
                      type="checkbox"
                      checked={config.validationSettings.requireTravelers}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        validationSettings: {
                          ...prev.validationSettings,
                          requireTravelers: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-[#FF1B7C] rounded focus:ring-2 focus:ring-[#FF1B7C]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="text-sm font-semibold text-gray-700">
                      Autoriser uniquement les réservations futures
                    </label>
                    <input
                      type="checkbox"
                      checked={config.validationSettings.allowFutureBookingsOnly}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        validationSettings: {
                          ...prev.validationSettings,
                          allowFutureBookingsOnly: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-[#FF1B7C] rounded focus:ring-2 focus:ring-[#FF1B7C]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Buttons */}
          <div className="border-t bg-gray-50 p-6 flex justify-between items-center gap-4">
            <button
              onClick={resetConfig}
              className="flex items-center gap-2 px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              <RefreshCw size={18} />
              Réinitialiser
            </button>

            <button
              onClick={saveConfig}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-[#FF1B7C] text-white rounded-lg font-medium hover:bg-[#FF1B7C]/90 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Configuration Active</h3>
              <p className="text-sm text-green-800">Les modifications sont sauvegardées localement et appliquées immédiatement à la plateforme.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentConfigPage;
