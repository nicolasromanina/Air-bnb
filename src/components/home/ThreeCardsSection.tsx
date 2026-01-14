import { Diamond } from 'lucide-react';

function ThreeCardsSection() {
  return (
    <section className="bg-white px-8 lg:px-16 xl:px-24 py-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div className="bg-[#E8E8E8] rounded-xl p-12 lg:p-14 flex flex-col justify-between min-h-[420px]">
            <div>
              <h3 className="text-[28px] lg:text-[32px] font-semibold text-black leading-tight mb-24">
                Sorem ipsum dolor sit amet
              </h3>
            </div>

            <div>
              <p className="text-[18px] lg:text-[20px] leading-relaxed">
                <span className="text-gray-500">Class</span> <span className="text-black">aptent taciti socios quad</span> <span className="text-gray-500">litora torquent .</span>
              </p>
            </div>
          </div>

          <div className="bg-black rounded-xl p-12 lg:p-14 flex flex-col justify-between min-h-[420px]">
            <div>
              <h3 className="text-[28px] lg:text-[32px] font-semibold text-white leading-tight mb-8">
                Sit amet, consectetur adipiscing elit.
              </h3>

              <p className="text-[16px] leading-relaxed text-white/90 mb-10">
                Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>

            <button className="bg-[#FF1B7C] hover:bg-[#E01669] text-white font-medium text-[16px] px-10 py-4 rounded-lg transition-colors w-full">
              Reserver maintenant
            </button>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-12 lg:p-14 flex flex-col justify-between min-h-[420px] relative">
            <div className="absolute top-8 right-8">
              <div className="w-12 h-12 bg-[#FF1B7C] rounded-full flex items-center justify-center">
                <Diamond className="w-6 h-6 text-white" fill="currentColor" />
              </div>
            </div>

            <div>
              <h3 className="text-[28px] lg:text-[32px] font-semibold text-black leading-tight mb-8">
                Inceptos himenaeos.
              </h3>

              <p className="text-[16px] leading-relaxed text-black/80 mb-10">
                Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>

            <div>
              <h4 className="text-[22px] lg:text-[24px] font-semibold text-black leading-tight">
                Sorem ipsum dolor sit amet
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThreeCardsSection;
