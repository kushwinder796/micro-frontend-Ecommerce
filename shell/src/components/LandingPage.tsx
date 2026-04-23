import HeroSection from './landing/HeroSection';
import FeaturesSection from './landing/FeaturesSection';
import StatsSection from './landing/StatsSection';
import TestimonialsSection from './landing/TestimonialsSection';

import LogoMarquee from './LogoMarquee';

const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Brand Marquee */}
      <div className="border-t border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
          <p
            className="text-center text-sm font-semibold leading-8 uppercase tracking-[0.2em] mb-12"
            style={{ color: 'var(--text-secondary)' }}
          >
            Trusted by Industry Leaders
          </p>
          <LogoMarquee />
        </div>
      </div>

      {/* Features */}
      <FeaturesSection />

      {/* Stats */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
};

export default LandingPage;