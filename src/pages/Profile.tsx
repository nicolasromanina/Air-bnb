import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Edit2,
  Save,
  X,
  AlertCircle,
  Loader2,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface UserProfile {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  profileImage?: string;
  createdAt?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    profileImage: '',
  });
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    profileImage: '',
  });

  useEffect(() => {
    // Charger les données du profil
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await api.getUserProfile();
        if (response.success && response.data) {
          setProfileData(response.data);
          setFormData(response.data);
        } else {
          // Si la requête échoue, utiliser les données disponibles
          if (user) {
            const defaultData = {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              phone: '',
              address: '',
              city: '',
              zipCode: '',
              country: '',
              profileImage: '',
            };
            setProfileData(defaultData);
            setFormData(defaultData);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        // Si la requête échoue, utiliser les données disponibles
        if (user) {
          const defaultData = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            country: '',
            profileImage: '',
          };
          setProfileData(defaultData);
          setFormData(defaultData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await api.updateUserProfile(formData);
      if (response.success && response.data) {
        setProfileData(response.data);
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès');
      } else {
        toast.error(response.error || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Vous avez été déconnecté');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 size={40} className="animate-spin text-[#FF1B7C]" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#FF1B7C] to-[#e0176d] h-32 relative">
              <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8">
              {/* Edit Button */}
              <div className="flex justify-end mb-8">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-[#FF1B7C] text-white px-6 py-2 rounded-lg hover:bg-[#e0176d] transition-colors"
                  >
                    <Edit2 size={18} />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      <X size={18} />
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-[#FF1B7C] text-white px-6 py-2 rounded-lg hover:bg-[#e0176d] transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nom et Prénom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      Prénom
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {profileData.firstName || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      Nom
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      placeholder="Votre nom"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {profileData.lastName || '-'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </span>
                  </label>
                  <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                    {profileData.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Non modifiable</p>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Phone size={16} />
                      Téléphone
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      placeholder="Votre téléphone"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {profileData.phone || '-'}
                    </p>
                  )}
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      Adresse
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      placeholder="Votre adresse"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {profileData.address || '-'}
                    </p>
                  )}
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      Ville
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      placeholder="Votre ville"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {profileData.city || '-'}
                    </p>
                  )}
                </div>

                {/* Code Postal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Code Postal
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      placeholder="Code postal"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {profileData.zipCode || '-'}
                    </p>
                  )}
                </div>

                {/* Pays */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pays
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B7C] focus:border-transparent outline-none"
                      placeholder="Votre pays"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {profileData.country || '-'}
                    </p>
                  )}
                </div>

                {/* Date d'inscription */}
                {profileData.createdAt && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} />
                        Membre depuis
                      </span>
                    </label>
                    <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                      {new Date(profileData.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div className="mt-12 pt-8 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
