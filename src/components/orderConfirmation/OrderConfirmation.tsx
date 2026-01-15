import { ChevronDown } from 'lucide-react';
import Narbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function OrderConfirmation() {
  return (
    
    <div className="min-h-screen bg-white">
      <section className="relative h-auto md:h-[304px] xl:h-[304px] bg-[#E8E8E8] overflow-hidden">
        <div className="max-w-[1440px] mx-auto h-full flex flex-col md:flex-row xl:flex-row">
          <div className="w-full md:w-1/2 xl:w-1/2 flex items-center px-6 py-12 md:pl-[55px] md:py-0 xl:pl-[55px] xl:py-0">
            <div>
              <h1 className="text-[36px] md:text-[48px] xl:text-[56px] font-black leading-[1.1] tracking-tight text-black mb-[16px] md:mb-[20px] xl:mb-[24px]">
                COMMANDE
                <br />
                CONFIRMÉ
              </h1>
              <p className="text-[14px] md:text-[14px] xl:text-[15px] leading-[1.6] text-black">
                Un email de confirmation vous sera envoyé :{' '}
                <span className="font-bold">exemple@gmail.com</span> . Si vous ne la recevez pas veuillez
                <br className="hidden xl:block" />
                consulter vos messages SPAM
              </p>
              <p className="text-[14px] md:text-[14px] xl:text-[15px] leading-[1.6] text-black mt-[16px] md:mt-[20px] xl:mt-[24px]">
                Commande #00045225
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/2 h-[240px] md:h-full xl:h-full">
            <img
              src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Hotel room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-[55px] py-[40px] md:py-[50px] xl:py-[60px]">
        <h2 className="text-[28px] md:text-[34px] xl:text-[40px] font-bold text-black mb-[40px] md:mb-[50px] xl:mb-[60px]">
          Détail de votre commande
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] lg:gap-[40px] xl:gap-[40px]">
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-[32px] md:mb-[36px] xl:mb-[40px] gap-4">
              <h3 className="text-[18px] md:text-[19px] xl:text-[20px] font-bold text-black">
                Historique des transactions
              </h3>
              <div className="flex items-center gap-[12px] md:gap-[14px] xl:gap-[16px]">
                <span className="text-[13px] md:text-[13px] xl:text-[14px] text-gray-600">Filter par</span>
                <button className="flex items-center gap-[6px] md:gap-[7px] xl:gap-[8px] px-[12px] md:px-[14px] xl:px-[16px] py-[6px] md:py-[7px] xl:py-[8px] border border-gray-300 rounded-[4px] bg-white text-[13px] md:text-[13px] xl:text-[14px] text-black hover:border-gray-400 transition-colors">
                  Plus récents
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-[24px] md:space-y-[28px] xl:space-y-[32px]">
              <div className="border-t border-gray-300 pt-[24px] md:pt-[28px] xl:pt-[32px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-[20px] md:gap-[22px] xl:gap-[24px]">
                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      CLIENT
                    </h4>
                    <p className="text-[16px] font-medium text-black mb-[8px]">
                      Jon Doe Lorem
                    </p>
                    <p className="text-[13px] text-gray-600 mb-[16px]">
                      Appartement lorem ipsum
                    </p>
                    <p className="text-[13px] text-black mb-[4px]">
                      <span className="font-semibold">Période :</span> 3 Jours
                    </p>
                    <p className="text-[13px] text-black font-semibold mb-[4px]">
                      Inclus
                    </p>
                    <p className="text-[12px] text-gray-600">Petit déjeuner</p>
                    <p className="text-[12px] text-gray-600">Pressing</p>
                    <p className="text-[12px] text-gray-600">Ménage</p>
                    <p className="text-[13px] text-black mt-[16px]">
                      <span className="font-semibold">Appartement n°</span> 205
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      PAIEMENT
                    </h4>
                    <div className="flex items-center gap-[8px]">
                      <svg className="w-[40px] h-[25px]" viewBox="0 0 40 25" fill="none">
                        <rect width="40" height="25" rx="3" fill="#1434CB"/>
                        <path d="M16.5 8.5L13.5 16.5H11.5L9.5 10.5C9.5 10.5 9.3 9.8 9 9.5C8.5 9 7.5 8.5 6.5 8.2V8H10.5C11.2 8 11.8 8.5 12 9.2L13 14L15.5 8.5H16.5ZM17.5 16.5L19 8.5H21L19.5 16.5H17.5ZM25.5 11C25.5 11.8 26 12.5 27.5 13C28.5 13.3 28.8 13.5 28.8 14C28.8 14.5 28.2 14.8 27.5 14.8C26.5 14.8 25.8 14.5 25.2 14.2L24.8 16C25.5 16.3 26.5 16.5 27.5 16.5C29.8 16.5 31 15.5 31 14C31 13 30.5 12.5 29 11.8C28.2 11.5 27.8 11.2 27.8 10.8C27.8 10.5 28.2 10.2 29 10.2C29.8 10.2 30.5 10.5 31 10.8L31.5 9C31 8.8 30.2 8.5 29.2 8.5C27 8.5 25.5 9.5 25.5 11ZM34.5 8.5C34 8.5 33.5 8.8 33.3 9.3L29.5 16.5H31.8L32.2 15.5H35L35.2 16.5H37.2L35.5 8.5H34.5ZM33 13.8L34 10.5L34.5 13.8H33Z" fill="white"/>
                      </svg>
                      <span className="text-[16px] text-black">****5632</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      MONTANT
                    </h4>
                    <p className="text-[24px] font-semibold text-black">
                      900€
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      COMANDE TOTAL
                    </h4>
                    <div className="space-y-[8px] mb-[24px]">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-black">Prix</span>
                        <span className="text-black font-medium">400€</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-black">Petit déjeuner</span>
                        <span className="text-black font-medium">100€</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-black">Pressing</span>
                        <span className="text-black font-medium">200€</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-black">Ménage</span>
                        <span className="text-black font-medium">200€</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-300 pt-[12px]">
                      <div className="flex justify-between text-[16px]">
                        <span className="text-black font-semibold">Total</span>
                        <span className="text-black font-bold">900€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-[24px] md:pt-[28px] xl:pt-[32px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-[20px] md:gap-[22px] xl:gap-[24px]">
                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      CLIENT
                    </h4>
                    <p className="text-[16px] font-medium text-black mb-[8px]">
                      Jon Doe Lorem
                    </p>
                    <p className="text-[13px] text-gray-600 mb-[16px]">
                      Appartement lorem ipsum
                    </p>
                    <p className="text-[13px] text-black mb-[4px]">
                      <span className="font-semibold">Période :</span> 3 Jours
                    </p>
                    <p className="text-[13px] text-black font-semibold mb-[4px]">
                      Inclus
                    </p>
                    <p className="text-[12px] text-gray-600">Petit déjeuner</p>
                    <p className="text-[12px] text-gray-600">Pressing</p>
                    <p className="text-[13px] text-black mt-[16px]">
                      <span className="font-semibold">Appartement n°</span> 205
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      PAIEMENT
                    </h4>
                    <div className="flex items-center gap-[8px]">
                      <svg className="w-[40px] h-[25px]" viewBox="0 0 40 25" fill="none">
                        <rect width="40" height="25" rx="3" fill="#EB001B"/>
                        <rect x="14" width="12" height="25" fill="#FF5F00"/>
                        <circle cx="14" cy="12.5" r="9" fill="#EB001B"/>
                        <circle cx="26" cy="12.5" r="9" fill="#F79E1B"/>
                      </svg>
                      <span className="text-[16px] text-black">****4852</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      MONTANT
                    </h4>
                    <p className="text-[24px] font-semibold text-black">
                      800€
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-black mb-[16px]">
                      COMANDE TOTAL
                    </h4>
                    <div className="space-y-[8px] mb-[24px]">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-black">Prix</span>
                        <span className="text-black font-medium">500€</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-black">Petit déjeuner</span>
                        <span className="text-black font-medium">100€</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-black">Pressing</span>
                        <span className="text-black font-medium">200€</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-300 pt-[12px]">
                      <div className="flex justify-between text-[16px]">
                        <span className="text-black font-semibold">Total</span>
                        <span className="text-black font-bold">800€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-5">
            <div className="border border-gray-200 rounded-[8px] overflow-hidden bg-white sticky top-[20px]">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Appartement"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-[20px] md:p-[22px] xl:p-[24px]">
                <h3 className="text-[18px] md:text-[19px] xl:text-[20px] font-bold text-black mb-[10px] md:mb-[11px] xl:mb-[12px]">
                  Appartement Nunc Ipsum
                </h3>
                <p className="text-[28px] md:text-[30px] xl:text-[32px] font-bold text-black mb-[14px] md:mb-[15px] xl:mb-[16px]">
                  1000€
                </p>
                <p className="text-[12px] md:text-[12px] xl:text-[13px] font-semibold text-black mb-[10px] md:mb-[11px] xl:mb-[12px]">
                  Inclus
                </p>
                <div className="grid grid-cols-2 gap-x-[14px] md:gap-x-[15px] xl:gap-x-[16px] gap-y-[6px] md:gap-y-[7px] xl:gap-y-[8px] mb-[20px] md:mb-[22px] xl:mb-[24px]">
                  <p className="text-[12px] md:text-[12px] xl:text-[13px] text-gray-700">Petit déjeuner</p>
                  <p className="text-[12px] md:text-[12px] xl:text-[13px] text-gray-700">Ménage tous les jours</p>
                  <p className="text-[12px] md:text-[12px] xl:text-[13px] text-gray-700">Pressing</p>
                  <p className="text-[12px] md:text-[12px] xl:text-[13px] text-gray-700">Dîner romantique</p>
                </div>
                <button className="w-full bg-[#FF3366] hover:bg-[#E62958] text-white font-semibold text-[15px] md:text-[15px] xl:text-[16px] py-[12px] md:py-[13px] xl:py-[14px] px-[20px] md:px-[22px] xl:px-[24px] rounded-[8px] transition-colors">
                  Reserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderConfirmation;
