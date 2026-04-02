import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from './Reveal';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';

const slides = [hero1, hero2, hero3];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(i => (i + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(i => (i - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Voyage ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          width={1920}
          height={1080}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/50" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <Reveal width="100%">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-[0.2em] text-cream mb-4">
            marycielo.travel
          </h1>
        </Reveal>
        <Reveal width="100%" delay={0.4}>
          <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-cream/80 mb-2">
            Votre voyage commence ici
          </p>
        </Reveal>
        <Reveal width="100%" delay={0.6}>
          <p className="font-arabic text-base md:text-lg text-cream/60 mb-10" dir="rtl">
            رحلتك تبدأ من هنا
          </p>
        </Reveal>
        <Reveal width="100%" delay={0.8} direction="up">
          <a
            href="#services"
            className="btn-primary"
          >
            Découvrir nos voyages
          </a>
        </Reveal>
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-cream/70 hover:text-cream transition-colors" aria-label="Précédent">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-cream/70 hover:text-cream transition-colors" aria-label="Suivant">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-cream w-6' : 'bg-cream/40'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
