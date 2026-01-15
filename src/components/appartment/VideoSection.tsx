import { Play } from "lucide-react";
import videoCover from "@/assets/video-cover.jpg";

const VideoSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
        {/* Large title */}
        <h2 className="font-montserrat font-bold text-gray-medium text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 leading-none">
          Lorem ipsum dolor
        </h2>
        
        {/* Video container */}
        <div className="relative aspect-[16/7] overflow-hidden">
          <img
            src={videoCover}
            alt="Luxury hotel room video preview"
            className="w-full h-full object-cover"
          />
          
          {/* Play button */}
          <button className="absolute inset-0 flex items-center justify-center group">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-background transition-colors">
              <Play className="w-6 h-6 lg:w-8 lg:h-8 text-foreground ml-1" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
