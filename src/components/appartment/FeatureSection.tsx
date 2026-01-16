import { Newspaper } from "lucide-react";
import bedroomSmall from "@/assets/bedroom-small.jpg";
import bedroomLarge from "@/assets/bedroom-large.jpg";

const GRID_CONTAINER = "max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20";

const FeatureSection = () => {
  return (
    <section className="py-12 lg:py-20">
      <div className={GRID_CONTAINER}>
        {/* Le background gris est maintenant à l'intérieur du grid container */}
        <div className="bg-[#EBEBEB] py-12 lg:py-16 px-8 lg:px-12 rounded-lg">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
            {/* Left Title */}
            <h1 className="font-serif text-[42px] leading-[1.15] tracking-tight text-foreground lg:text-[52px]">
              Consectetur
              <br />
              ipsum elit
            </h1>

            {/* Right Paragraph */}
            <p className="text-base leading-[1.7] text-foreground lg:text-lg">
              <span className="font-semibold">Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</span>{" "}
              <span className="text-muted-foreground">Class aptent taciti sociosqu ad</span>{" "}
              <span className="font-semibold">litora torquent per conubia nostra, per inceptos himenaeos.</span>{" "}
              <span className=" text-muted-foreground">Curabitur tempus urna at turpis</span>{" "}
              <span className="font-semibold">condimentum lobortis.</span>
            </p>
          </div>

          {/* Cards Section */}
          <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-10">
            {/* Left Column - Cards */}
            <div className="flex flex-col gap-4">
              {/* Dark Card -> Changé en bg-black pur */}
              <div className="rounded-lg bg-black px-7 pb-7 pt-6 text-white">
                <h2 className="mb-8 text-lg font-normal leading-snug lg:text-xl">
                  Nunc vulputate libero et velit
                  <br />
                  interdum, ac{" "}
                  <span className="text-gray-500">aliquet odio mattis.</span>
                </h2>

                <div className="flex items-end justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/20 bg-gray-500">
                    <Newspaper className="h-5 w-5 opacity-80" />
                  </div>
                  <p className="text-right text-[13px] leading-relaxed text-white/60">
                    Amet, consectetur
                    <br />
                    adipiscing elit.
                  </p>
                </div>
              </div>

              {/* Light Card */}
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                <div className="flex">
                  <div className="flex flex-1 flex-col justify-center px-5 py-4">
                    <h3 className="text-[15px] font-semibold leading-snug text-black">
                      Nunc vulputate
                      <br />
                      libero
                    </h3>
                  </div>
                  <div className="w-28 flex-shrink-0 lg:w-32">
                    <img
                      src={bedroomSmall}
                      alt="bedroom"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-border px-5 py-4">
                  <p className="text-[13px] leading-relaxed text-gray-500">
                    Rorem ipsum dolor sit amet,
                    <br />
                    consectetur adipiscing elit
                  </p>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FF2E63]">
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Large Image */}
            <div className="flex flex-col justify-end">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={bedroomLarge}
                  alt="bedroom large"
                  className="h-auto w-full object-cover lg:h-[200px]"
                />
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-12 flex flex-col justify-between gap-6 sm:flex-row lg:mt-16">
            <p className="max-w-[260px] text-[13px] leading-relaxed text-gray-500">
              Class aptent taciti sociosqu ad litora
              <br />
              torquent per conubia nostra, per
              <br />
              inceptos himenaeos.
            </p>
            <p className="max-w-[220px] text-[13px] leading-relaxed text-gray-500 sm:text-right">
              Class aptent taciti sociosqu
              <br />
              ad litora torquent .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;