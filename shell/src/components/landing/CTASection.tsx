import { useState } from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-cyan-500" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-purple-500" />
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <div className="relative p-12 sm:p-16 rounded-3xl border overflow-hidden" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, #06b6d420, transparent, #8b5cf620)', pointerEvents: 'none' }} />

          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-cyan-500/20 text-cyan-400 bg-cyan-500/5 mb-8">Get Started Today</span>
          
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Ready to transform your <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">shopping experience?</span>
          </h2>

          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of happy customers and start shopping today. No credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link to="/auth/register" className="px-10 py-4 rounded-2xl text-sm font-bold text-white shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/40" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)' }}>
              Create Free Account
            </Link>
            <Link to="/auth/login" className="px-10 py-4 rounded-2xl text-sm font-semibold border transition-all duration-300 hover:-translate-y-1" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              Sign In →
            </Link>
          </div>

          {/* Newsletter */}
          <div className="border-t pt-10" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Stay updated with our newsletter</p>
            <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-cyan-500/30"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
              <button type="submit" className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                {subscribed ? '✓ Done!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
