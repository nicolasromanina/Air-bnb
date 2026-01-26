import React from 'react';

const HeroPreview: React.FC<any> = ({ hero }) => {
  if (!hero) return null;
  return (
    <section className="mb-6 bg-gradient-to-r from-pink-50 to-white p-6 rounded shadow-sm">
      <div className="flex items-center gap-4">
        {hero.image ? (
          <img src={hero.image} alt="hero" className="w-36 h-24 object-cover rounded" />
        ) : (
          <div className="w-36 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">No image</div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{hero.title}</h2>
          <p className="text-sm text-gray-600">{hero.subtitle}</p>
        </div>
      </div>
    </section>
  );
};

const WelcomePreview: React.FC<any> = ({ welcome }) => {
  if (!welcome) return null;
  return (
    <section className="mb-6 p-4 rounded bg-white shadow-sm">
      <h3 className="font-semibold mb-2">{welcome.title}</h3>
      <div className="text-sm text-gray-700 space-y-2">
        {(welcome.paragraphs || []).map((p:string,i:number)=>(<p key={i}>{p}</p>))}
      </div>
    </section>
  );
};

const StatsPreview: React.FC<any> = ({ stats }) => {
  if (!stats) return null;
  return (
    <section className="mb-6 p-4 rounded bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s:any, i:number)=>(
          <div key={i} className="p-3 bg-gray-50 rounded text-center">
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ServicesPreview: React.FC<any> = ({ services }) => {
  if (!services) return null;
  return (
    <section className="mb-6 p-4 rounded bg-white shadow-sm">
      <h4 className="font-semibold mb-2">Services</h4>
      <div className="grid grid-cols-1 gap-3">
        {services.map((s:any,i:number)=>(
          <div key={i} className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded" />
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-gray-600">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const LogosPreview: React.FC<any> = ({ logos }) => {
  if (!logos) return null;
  return (
    <section className="mb-6 p-4 rounded bg-white shadow-sm">
      <div className="flex gap-3 flex-wrap items-center">
        {logos.map((l:string,i:number)=>(
          <img key={i} src={l} alt={`logo-${i}`} className="h-10 object-contain" />
        ))}
      </div>
    </section>
  );
};

const MarqueePreview: React.FC<any> = ({ marquee }) => {
  if (!marquee) return null;
  return (
    <section className="mb-6 p-3 rounded bg-gradient-to-r from-yellow-50 to-white">
      <marquee className="text-sm text-gray-700">{marquee}</marquee>
    </section>
  );
};

const HomePreview: React.FC<{data:any}> = ({data}) => {
  const order = data?.sectionsOrder || ['hero','welcome','stats','services','marquee','logos'];
  return (
    <div className="p-4">
      {order.map((s:string)=>{
        switch(s){
          case 'hero': return <HeroPreview key={s} hero={data.hero} />;
          case 'welcome': return <WelcomePreview key={s} welcome={data.welcome} />;
          case 'stats': return <StatsPreview key={s} stats={data.stats} />;
          case 'services': return <ServicesPreview key={s} services={data.services} />;
          case 'logos': return <LogosPreview key={s} logos={data.logos} />;
          case 'marquee': return <MarqueePreview key={s} marquee={data.marquee} />;
          default: return null;
        }
      })}
    </div>
  );
};

export default HomePreview;
