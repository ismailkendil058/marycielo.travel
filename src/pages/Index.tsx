import { useState, useCallback } from 'react';
import IntroAnimation from '@/components/IntroAnimation';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => {
    if (sessionStorage.getItem('mc_intro_seen')) return false;
    return true;
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('mc_intro_seen', '1');
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <main>
        <HeroSection />
        <ServicesSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
