import { Users, Bed, Building2, Tv, Armchair, BedDouble, Play, ChevronDown, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

function AppartmentDetail() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [nights, setNights] = useState(2);

  const toggleService = (service: string) => {
    setSelectedService(selectedService === service ? null : service);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="w-full bg-[#E8E8E8]">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-start px-8 lg:px-16 xl:px-24 py-20 lg:py-32">
            <div className="max-w-[500px]">
              <h1 className="text-[44px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.1] tracking-tight text-black mb-8">
                CONSECTETUR ADIPISCING ELIT.
              </h1>
              <p className="text-[15px] leading-relaxed text-black">
                Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-auto">
            <img
              src="https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Modern bedroom interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 lg:py-24 px-6 lg:px-16 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Luxury bedroom with city view"
                className="w-full h-[320px] lg:h-[360px] object-cover rounded-sm"
              />
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <Play className="w-6 h-6 text-black ml-1" fill="black" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <img
                src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Bedroom view 1"
                className="w-full h-[100px] object-cover rounded-sm"
              />
              <img
                src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Bedroom view 2"
                className="w-full h-[100px] object-cover rounded-sm"
              />
              <img
                src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Bedroom view 3"
                className="w-full h-[100px] object-cover rounded-sm"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[32px] lg:text-[36px] font-bold text-black leading-tight">
              Aptent taciti sociosqu ad litora
            </h2>

            <p className="text-[15px] leading-relaxed text-black">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm">
                <Users className="w-4 h-4" />
                <span>jusqu'à 4 invitées</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm">
                <Bed className="w-4 h-4" />
                <span>2 chambres à coucher</span>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-sm">
              <p className="text-sm text-black">
                Class aptent taciti per inceptos himenaeos.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-black mb-4 pb-3 border-b border-gray-300">
                Information générale
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-black">Prix standard</span>
                  <span className="text-sm font-semibold text-black">300€</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-black">Nombre de personne</span>
                  <span className="text-sm font-semibold text-black">jusqu'à 4 personnes</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-black">Type de logement</span>
                  <span className="text-sm font-semibold text-black">Logement sans fumeur</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-black">Offert</span>
                  <span className="text-sm font-semibold text-black">Thé, café ,petit déjeuné</span>
                </div>
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm text-black">Sécurité</span>
                  <span className="text-sm font-semibold text-black text-right">Parking sécurisé avec caméra de surveillance</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-black text-white py-4 rounded-sm font-medium hover:bg-gray-900 transition-colors">
              Reserver maintenant
            </button>
          </div>
        </div>
      </section>

      <section className="w-full py-16 lg:py-24 px-6 lg:px-16 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-[28px] lg:text-[32px] font-bold text-black mb-6">
                Détails de l'appartement
              </h2>
              <p className="text-sm text-black mb-8">
                Class aptent taciti per inceptos himenaeos.
              </p>

              <div className="border border-gray-300 rounded-sm px-6 py-4 mb-8">
                <p className="text-sm font-medium text-black">
                  Appartement lorem ipsum dolor sit amet
                </p>
              </div>

              <h3 className="text-base font-bold text-black mb-4">Description</h3>

              <div className="bg-gray-50 p-6 rounded-sm">
                <p className="text-[14px] leading-relaxed text-black">
                  Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed feugiat. Donec sed condimentum velit, si amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-black mb-3">
                Incluses et sur demande
              </h3>
              <p className="text-sm text-black mb-6">
                Class aptent taciti per inceptos himenaeos.
              </p>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <img
                  src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Breakfast"
                  className="w-full h-[80px] object-cover rounded-lg"
                />
                <img
                  src="https://images.pexels.com/photos/4792484/pexels-photo-4792484.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Amenities"
                  className="w-full h-[80px] object-cover rounded-lg"
                />
                <img
                  src="https://images.pexels.com/photos/6893747/pexels-photo-6893747.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Bedroom"
                  className="w-full h-[80px] object-cover rounded-lg"
                />
                <img
                  src="https://images.pexels.com/photos/3727258/pexels-photo-3727258.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Coffee"
                  className="w-full h-[80px] object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => toggleService('breakfast')}
                className="w-full flex items-center justify-between px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-black">Petit déjeuner</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    selectedService === 'breakfast' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {selectedService === 'breakfast' && (
                <div className="border border-gray-200 rounded-lg p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-black mb-4">PETIT DÉJEUNER</h4>
                    <p className="text-sm text-black mb-4">
                      Adipiscing elit vulputate libero et velit interdum, ac dignissim laoreet.
                    </p>
                    <p className="text-[24px] font-bold text-black mb-3">300€</p>
                    <p className="text-xs text-gray-600 mb-1">12 Juin 2025</p>
                    <p className="text-xs text-gray-600">Appartement n° 205</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">Nombre de nuit</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setNights(Math.max(1, nights - 1))}
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold">{nights}</span>
                        <button
                          onClick={() => setNights(nights + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-black text-white rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-black">Montant à payer</span>
                      <span className="text-lg font-bold text-black">800€</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#EC4899] text-white py-3 rounded-lg font-medium hover:bg-[#DB2777] transition-colors">
                    Passer au paiement
                  </button>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Prix: 800€</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => toggleService('romantic')}
                className="w-full flex items-center justify-between px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-black">Entre romantique</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    selectedService === 'romantic' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <button
                onClick={() => toggleService('housekeeping')}
                className="w-full flex items-center justify-between px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-black">Ménage tous les jours</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    selectedService === 'housekeeping' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <button
                onClick={() => toggleService('laundry')}
                className="w-full flex items-center justify-between px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-black">Service de pressing</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    selectedService === 'laundry' ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 lg:py-24 px-6 lg:px-16 bg-[#E8E8E8]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-[36px] lg:text-[42px] font-bold text-black leading-tight mb-12">
                LOREM IPSUM DOLOR SIT AMET.
              </h2>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-[75px] h-[75px] bg-gray-600 rounded flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black mb-2">
                      Class aptent taciti torquent .
                    </h3>
                    <p className="text-sm text-black leading-relaxed">
                      Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-[75px] h-[75px] bg-gray-600 rounded flex items-center justify-center">
                    <Tv className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="pt-3">
                    <h3 className="text-base font-bold text-black mb-2">
                      Per inceptos himenaeos
                    </h3>
                    <p className="text-sm text-black leading-relaxed">
                      Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-[75px] h-[75px] bg-gray-600 rounded flex items-center justify-center">
                    <Armchair className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black mb-2">
                      Velit interdum ac aliquet
                    </h3>
                    <p className="text-sm text-black leading-relaxed">
                      Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EC4899] rounded-full flex items-center justify-center flex-shrink-0">
                <BedDouble className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Worem ipsum</p>
                <p className="text-sm text-black">dolor sit amet</p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Luxury bedroom"
              className="w-full h-auto rounded-sm shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 lg:py-24 px-6 lg:px-16 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <p className="text-sm text-black leading-relaxed max-w-[600px]">
              Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="bg-black p-10 rounded-lg text-white h-[320px] flex flex-col justify-between">
              <h3 className="text-[24px] leading-tight">
                <span className="text-gray-400">Class</span> aptent taciti socios quad{' '}
                <span className="text-gray-400">litora torquent .</span>
              </h3>
              <p className="text-lg font-semibold">Dolor sit</p>
            </div>

            <div className="h-[320px] rounded-lg overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Modern bedroom"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-[#E8E8E8] p-10 rounded-lg h-[320px] flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-black mb-6">
                Sorem ipsum dolor sit amet
              </h3>
              <p className="text-[20px] leading-snug">
                <span className="text-black font-semibold">Class</span>{' '}
                <span className="font-bold text-black">aptent taciti socios quad</span>{' '}
                <span className="text-gray-500">litora torquent .</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center h-[100px] hover:border-gray-400 transition-colors">
              <span className="text-lg font-bold text-black">Logoipsum</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center h-[100px] hover:border-gray-400 transition-colors">
              <span className="text-lg font-bold text-black">Logoipsum</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center h-[100px] hover:border-gray-400 transition-colors">
              <span className="text-lg font-bold text-black">LOGOIPSUM</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center h-[100px] hover:border-gray-400 transition-colors">
              <span className="text-lg font-bold text-black">LOGOIPSUM</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center h-[100px] hover:border-gray-400 transition-colors">
              <span className="text-lg font-bold text-black">Logoipsum</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AppartmentDetail;
