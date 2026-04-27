import { useState, useEffect, useCallback } from 'react';

const testimonials = [
  { name: 'Mohit Sharma ', role: 'Fashion Buyer', text: 'The best e-commerce platform I have ever used. Lightning fast and the UI is absolutely gorgeous!', rating: 5, avatar: '#ec4899' },
  { name: 'Kushwinder', role: 'Tech Enthusiast', text: 'Real-time order tracking and instant chat support made my shopping experience incredibly smooth.', rating: 5, avatar: '#06b6d4' },
  { name: 'Amit ', role: 'Small Business Owner', text: 'Switched from Shopify and never looked back. The micro-frontend architecture is game-changing.', rating: 5, avatar: '#8b5cf6' },
  { name: 'Mukul Sharma', role: 'Developer', text: 'As a developer, I appreciate the clean architecture. As a customer, I love the user experience!', rating: 5, avatar: '#10b981' },
  { name: 'Priya Sharma', role: 'Regular Shopper', text: 'AI-powered search finds exactly what I need. Secure payments give me peace of mind every time.', rating: 4, avatar: '#f59e0b' },
];

const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => setActive((p) => (p + 1) % testimonials.length), []);
  const prev = useCallback(() => setActive((p) => (p - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <section className="relative py-18 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-5 bg-purple-500 -z-10" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Loved by <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">thousands</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>See what our customers have to say about their experience.</p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
          <div className="relative overflow-hidden rounded-3xl border p-10 sm:p-14" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            {/* Quote mark */}
            <div className="absolute top-6 left-8 text-8xl font-serif opacity-10" style={{ color: 'var(--accent-color)' }}>"</div>

            <div className="relative">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[active].rating }, (_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-xl sm:text-2xl font-medium leading-relaxed mb-8 min-h-[100px]" style={{ color: 'var(--text-primary)' }}>
                "{testimonials[active].text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: `linear-gradient(135deg, ${testimonials[active].avatar}, ${testimonials[active].avatar}88)` }}>
                  {testimonials[active].name[0]}
                </div>
                <div>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{testimonials[active].name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{testimonials[active].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>←</button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className="h-2 rounded-full transition-all duration-300" style={{ width: active === i ? 32 : 8, backgroundColor: active === i ? 'var(--accent-color)' : 'var(--border-color)' }} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
