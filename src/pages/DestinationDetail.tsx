import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDestinationById, getServices } from '@/lib/store';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import Footer from '@/components/Footer';
import { OptimizedImage } from '@/components/OptimizedImage';
import { cn } from '@/lib/utils';

const DestinationDetail = () => {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  const destination = getDestinationById(destinationId || '');
  const services = getServices();
  const service = services.find(s => s.id === destination?.service_id);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-display text-2xl text-foreground mb-4">Destination introuvable</p>
          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const images = destination.images;
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Image carousel */}
      <div className="relative h-[50vh] md:h-[60vh] bg-muted overflow-hidden">
        {hasImages ? (
          <>
            {images.map((src, i) => (
              <OptimizedImage
                key={i}
                src={src}
                alt={`${destination.name_fr} ${i + 1}`}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                  i === currentImg ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
              />
            ))}
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImg(i => (i - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream">
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button onClick={() => setCurrentImg(i => (i + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream">
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="font-display text-3xl text-foreground/30">{destination.name_fr}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-foreground/30" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-cream/80 hover:text-cream font-body text-sm tracking-wider z-10"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
      </div>

      {/* Content */}
      <div className="section-padding max-w-3xl mx-auto text-center flex flex-col items-center">
        <h1 className="font-display text-3xl md:text-5xl text-foreground mb-2">{destination.name_fr}</h1>
        <p className="font-arabic text-lg text-muted-foreground mb-8" dir="rtl">{destination.name_ar}</p>

        {service && (
          <p className="font-body text-xs tracking-wider uppercase text-primary mb-6">
            {service.name_fr}
          </p>
        )}

        <p className="font-body text-base leading-relaxed text-foreground/80 mb-4 max-w-2xl">
          {destination.description_fr}
        </p>
        {destination.description_ar && (
          <p className="font-arabic text-base leading-relaxed text-muted-foreground mb-10 max-w-2xl" dir="rtl">
            {destination.description_ar}
          </p>
        )}

        <button onClick={() => setShowBooking(true)} className="btn-primary">
          Réserver maintenant / احجز الآن
        </button>
      </div>

      {showBooking && (
        <BookingModal
          service={service?.name_fr || ''}
          destination={destination.name_fr}
          onClose={() => setShowBooking(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default DestinationDetail;
