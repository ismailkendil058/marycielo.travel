import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServices, getDestinationsByService } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

import serviceVisa from '@/assets/service-visa.jpg';
import serviceBilletterie from '@/assets/service-billetterie.jpg';
import serviceOmra from '@/assets/service-omra.jpg';
import serviceCarte from '@/assets/service-carte.jpg';
import serviceOrganise from '@/assets/service-organise.jpg';

const defaultImages: Record<string, string> = {
  '1': serviceVisa, '2': serviceBilletterie, '3': serviceOmra, '4': serviceCarte, '5': serviceOrganise,
};

const ServiceDestinations = () => {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const services = getServices();
  const service = services.find(s => s.slug === serviceSlug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-display text-2xl text-foreground mb-4">Service introuvable</p>
          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const destinations = getDestinationsByService(service.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-[40vh] overflow-hidden">
        <img
          src={service.cover_image_url || defaultImages[service.id] || serviceVisa}
          alt={service.name_fr}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-3xl md:text-5xl text-cream tracking-wider mb-2">
            {service.name_fr}
          </h1>
          <p className="font-arabic text-lg text-cream/70" dir="rtl">{service.name_ar}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 text-cream/80 hover:text-cream font-body text-sm tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
      </div>

      {/* Destinations */}
      <div className="section-padding max-w-6xl mx-auto">
        {destinations.length === 0 ? (
          <p className="text-center text-muted-foreground font-body">Aucune destination disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(dest => (
              <button
                key={dest.id}
                onClick={() => navigate(`/destination/${dest.id}`)}
                className="group text-left bg-background border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {dest.images.length > 0 ? (
                    <img src={dest.images[0]} alt={dest.name_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-display text-lg">
                      {dest.name_fr}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-foreground mb-1">{dest.name_fr}</h3>
                  <p className="font-arabic text-sm text-muted-foreground" dir="rtl">{dest.name_ar}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDestinations;
