import { useNavigate } from 'react-router-dom';
import { getServices } from '@/lib/store';
import { OptimizedImage } from './OptimizedImage';
import { Reveal } from './Reveal';
import serviceVisa from '@/assets/service-visa.jpg';
import serviceBilletterie from '@/assets/service-billetterie.jpg';
import serviceOmra from '@/assets/service-omra.jpg';
import serviceCarte from '@/assets/service-carte.jpg';
import serviceOrganise from '@/assets/service-organise.jpg';

const defaultImages: Record<string, string> = {
  '1': serviceVisa,
  '2': serviceBilletterie,
  '3': serviceOmra,
  '4': serviceCarte,
  '5': serviceOrganise,
};

const ServicesSection = () => {
  const navigate = useNavigate();
  const services = getServices();

  return (
    <section id="services" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Reveal width="100%">
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
              Nos Services
            </h2>
          </Reveal>
          <Reveal width="100%" delay={0.4}>
            <p className="font-arabic text-lg text-muted-foreground" dir="rtl">
              خدماتنا
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={0.1 * (index % 3)} width="100%">
              <button
                onClick={() => navigate(`/services/${service.slug}`)}
                className="group relative overflow-hidden aspect-[3/4] bg-muted cursor-pointer w-full"
              >
                <OptimizedImage
                  src={service.cover_image_url || defaultImages[service.id] || serviceVisa}
                  alt={service.name_fr}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={1000}
                />
                <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4">
                  <h3 className="font-display text-2xl md:text-3xl text-cream tracking-wider mb-1">
                    {service.name_fr}
                  </h3>
                  <p className="font-arabic text-sm text-cream/70" dir="rtl">
                    {service.name_ar}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
