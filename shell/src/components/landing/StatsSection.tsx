import { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2000, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [visible, end]);

  return <div ref={ref} className="text-4xl sm:text-5xl font-black tabular-nums">{count.toLocaleString()}{suffix}</div>;
};

const stats = [
  { value: 1500, suffix: '+', label: 'Active Users', desc: 'Growing every day', icon: '👥', color: '#06b6d4' },
  { value: 10, suffix: 'K+', label: 'Products Sold', desc: 'And counting', icon: '📦', color: '#8b5cf6' },
  { value: 99, suffix: '%', label: 'Uptime', desc: 'Enterprise reliability', icon: '⚡', color: '#10b981' },
  { value: 4, suffix: '.7', label: 'User Rating', desc: 'Out of 5 stars', icon: '⭐', color: '#f59e0b' },
];

const StatsSection: React.FC = () => (
  <section className="relative py-24">
    <div className="absolute inset-0 -z-10 border-y" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="group text-center p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${s.color}15, 
            ${s.color}05)`, border: `1px solid ${s.color}25` }}>{s.icon}</div>
            <div style={{ color: s.color }}><AnimatedCounter end={s.value} suffix={s.suffix} /></div>
            <h3 className="text-lg font-bold mt-3 mb-1" style={{ color: 'var(--text-primary)' }}>{s.label}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
