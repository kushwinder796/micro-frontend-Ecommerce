import React from 'react';

const LogoMarquee: React.FC = () => {
    const companies = [
        { name: 'Apple', icon: '' },
        { name: 'Dell', icon: 'DELL' },
        { name: 'Samsung', icon: 'SAMSUNG' },
        { name: 'Sony', icon: 'SONY' },
        { name: 'Microsoft', icon: 'Microsoft' },
        { name: 'Google', icon: 'Google' },
        { name: 'Amazon', icon: 'Amazon' },
        { name: 'HP', icon: 'HP' },
        { name: 'Lenovo', icon: 'Lenovo' },
        { name: 'Asus', icon: 'ASUS' },
        { name: "Acer", icon: "Acer" },
        { name: "kk", icon: "kk thakur" },
        { name: "Mukul", icon: "Mukul sharma" }
    ];

    return (
        <div className="relative w-full py-12 bg-black/40 overflow-hidden border-y border-zinc-800/50 backdrop-blur-sm">
            <div className="flex whitespace-nowrap animate-marquee group">
                {/* First set of companies */}
                <div className="flex items-center space-x-12 px-6">
                    {companies.map((company, index) => (
                        <div
                            key={`comp-1-${index}`}
                            className="flex items-center space-x-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                            <span className="text-2xl font-bold text-white tracking-widest">{company.name}</span>
                        </div>
                    ))}
                </div>
                {/* Second set for seamless loop */}
                <div className="flex items-center space-x-12 px-6">
                    {companies.map((company, index) => (
                        <div
                            key={`comp-2-${index}`}
                            className="flex items-center space-x-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                            <span className="text-2xl font-bold text-white tracking-widest">{company.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/80 to-transparent pointer-events-none z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/80 to-transparent pointer-events-none z-10"></div>
        </div>
    );
};

export default LogoMarquee;
