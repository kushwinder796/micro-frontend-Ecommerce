import { useState } from 'react';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Search',
    description:
      'Smart product recommendations and intelligent search powered by cutting-edge machine learning.',
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: '#9669fd',
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    description:
      'Multiple payment gateways with Stripe, PayPal, and crypto. Instant refunds and dispute resolution.',
    gradient: 'from-cyan-500 to-blue-600',
    bgGlow: '#10bfde',
  },
  {
    icon: '💬',
    title: 'Live Chat Support',
    description:
      'Instant customer support with AI chatbot and human agents available 24/7 via real-time SignalR.',
    gradient: 'from-blue-500 to-indigo-600',
    bgGlow: '#2d77f0',
  },
];

const FeaturesSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-18 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-5 bg-cyan-500" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-cyan-500/20 text-cyan-400 bg-cyan-500/5 mb-6">
            Features
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              sell smarter
            </span>
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Our platform is packed with powerful features designed to help you
            grow your business and delight your customers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer"
              style={{
                borderColor:
                  hoveredIndex === i ? `${feature.bgGlow}40` : 'var(--border-color)',
                backgroundColor:
                  hoveredIndex === i ? `${feature.bgGlow}08` : 'var(--bg-secondary)',
                transform: hoveredIndex === i ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow:
                  hoveredIndex === i
                    ? `0 20px 60px ${feature.bgGlow}15`
                    : 'none',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                style={{ background: feature.bgGlow, opacity: hoveredIndex === i ? 0.05 : 0 }}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 ${hoveredIndex === i ? 'scale-110' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${feature.bgGlow}20, ${feature.bgGlow}05)`,
                  border: `1px solid ${feature.bgGlow}30`,
                }}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
