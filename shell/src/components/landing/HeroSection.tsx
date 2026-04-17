import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative isolate overflow-hidden min-h-screen flex items-center">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 transition-transform duration-[2000ms] ease-out"
          style={{
            background: 'radial-gradient(circle, #06b6d4, transparent)',
            left: `${mousePos.x * 0.02}%`,
            top: `${mousePos.y * 0.02}%`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #8b5cf6, transparent)',
            right: '10%',
            bottom: '10%',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-10"
          style={{
            background: 'radial-gradient(circle, #ec4899, transparent)',
            left: '60%',
            top: '20%',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-[fadeInUp_0.8s_ease-out]">

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              <span className="block" style={{ color: 'var(--text-primary)' }}>
                Shopping
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-lg leading-relaxed max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Experience the next generation of e-commerce with our
              lightning-fast, micro-frontend platform. Secure payments, real-time
              tracking, and a stunningly beautiful interface.
            </p>  

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/auth/register"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
                }}
              >
                <span className="relative z-10">Start Shopping</span>
                <svg
                  className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link
                to="/auth/login"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                Sign In
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-3">
                {['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        borderColor: 'var(--bg-primary)',
                        background: `linear-gradient(135deg, ${color}, ${color}88)`,
                      }}
                    >
                      {['A', 'K', 'M', 'P'][i]}
                    </div>
                  )
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Trusted by <span className="text-cyan-400">1,500+</span>{' '}
                  happy customers
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual - Dashboard Preview */}
          <div className="relative animate-[fadeInUp_1s_ease-out_0.2s_both]">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
              {/* Window chrome */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
              </div>

              {/* Dashboard Preview Content */}
              <div className="p-6 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Revenue',
                      value: '$12.4K',
                      change: '+12.5%',
                      color: '#06b6d4',
                    },
                    {
                      label: 'Orders',
                      value: '1,248',
                      change: '+8.2%',
                      color: '#8b5cf6',
                    },
                    {
                      label: 'Users',
                      value: '1,563',
                      change: '+23.1%',
                      color: '#ec4899',
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                    >
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: stat.color }}
                      >
                        {stat.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mini chart visualization */}
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-zinc-400">
                      Sales Overview
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium">
                      This Week
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5 h-16">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          background: `linear-gradient(to top, #06b6d4${i === 5 ? '' : '80'}, #3b82f6${i === 5 ? '' : '40'})`,
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Product rows */}
                <div className="space-y-2">
                  {[
                    {
                      name: 'Premium Headphones',
                      price: '₹299',
                      status: 'In Stock',
                    },
                    {
                      name: 'Smart Watch Pro',
                      price: '₹449',
                      status: 'Selling Fast',
                    },
                    {
                      name: 'Wireless Earbuds',
                      price: '₹129',
                      status: 'New Arrival',
                    },
                  ].map((product, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xs">
                          {['🎧', '⌚', '🎵'][i]}
                        </div>
                        <span className="text-sm text-zinc-300">
                          {product.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-white">
                          {product.price}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                          {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
