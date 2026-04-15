import { Link } from 'react-router-dom';
import LogoMarquee from './LogoMarquee';
import AIChatBox from './AIChatBox';

const LandingPage: React.FC = () => {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold leading-6 text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
                What's New
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-zinc-300">
                <span>Just shipped v1.0</span>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl bg-gradient-to-r from-white via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
            E-commerce Reimagined for the Modern Web
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Experience the next generation of online shopping with our lightning-fast, micro-frontend powered platform. Secure, scalable, and stunningly beautiful.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              to="/auth/register"
              className="rounded-xl bg-cyan-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-900/20 hover:bg-cyan-500 transition-all"
            >
              Get Started
            </Link>
            <Link to="/auth/login" className="text-sm font-semibold leading-6 text-white hover:text-cyan-400 transition-colors">
              Sign In <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-zinc-900/50 p-2 ring-1 ring-inset ring-zinc-700/50 lg:-m-4 lg:rounded-2xl lg:p-4 backdrop-blur-3xl">
              <div className="flex items-center gap-4 border-b border-zinc-800 pb-4 mb-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Premium Preview</div>
              </div>
              <img
                src="/ecommerce_hero_preview.png"
                alt="E-commerce Dashboard Preview"
                className="w-full h-auto max-w-full rounded-2xl shadow-2xl border border-white/10 transition-all duration-700 hover:scale-[1.02] hover:shadow-cyan-500/10"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Logo Marquee section */}
      <div className="mt-20 sm:mt-32 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
          <p className="text-center text-sm font-semibold leading-8 text-zinc-500 uppercase tracking-[0.2em] mb-12">
            Trusted by Industry Leaders
          </p>
          <LogoMarquee />
        </div>
      </div>
      
      <AIChatBox />
    </div>
  );
};

export default LandingPage;