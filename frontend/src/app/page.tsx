'use client';

import Link from 'next/link';
import { Shield, Zap, DollarSign, Brain, BarChart3, Globe, ArrowRight, ChevronRight } from 'lucide-react';

const features = [
  { icon: <Shield className="w-6 h-6" />, title: 'Blockchain Verification', desc: 'Immutable proof of ownership registered on Stellar via Soroban smart contracts.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Smart Licenses', desc: 'Programmable license terms — personal, commercial, editorial, enterprise, and exclusive.' },
  { icon: <DollarSign className="w-6 h-6" />, title: 'Auto Royalties', desc: 'Automatic royalty distribution on every license purchase, enforced by smart contracts.' },
  { icon: <Brain className="w-6 h-6" />, title: 'AI Detection', desc: 'AI-powered copyright detection to identify unauthorized usage of your assets.' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Analytics Dashboard', desc: 'Real-time insights into revenue, licensing activity, and asset performance.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Global Access', desc: 'Borderless licensing powered by the Stellar network — fast, cheap, and accessible.' },
];

const stats = [
  { value: '1,247', label: 'Assets Protected' },
  { value: '356', label: 'Licenses Sold' },
  { value: '$89K+', label: 'Revenue Distributed' },
  { value: '234', label: 'Active Creators' },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Upload and register your digital asset on the Stellar blockchain with verifiable proof of ownership.' },
  { num: '02', title: 'License', desc: 'Create programmable license templates with custom terms, pricing, and royalty rates.' },
  { num: '03', title: 'Earn', desc: 'Receive automatic royalty payments every time someone purchases a license for your asset.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-sm">L</div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Lumina</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
          </div>
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium px-5 py-2 rounded-xl
              hover:from-violet-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section 
        className="relative pb-20 px-6 flex justify-center w-full"
        style={{ paddingTop: '180px' }}
      >
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none" />

        <div className="w-full max-w-5xl flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-sm text-white/60 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Stellar &amp; Soroban
          </div>

          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 w-full">
            <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent block sm:inline">
              AI-Powered Digital
            </span>
            <span className="hidden sm:inline"><br /></span>
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent block sm:inline">
              Asset Licensing
            </span>
          </h1>

          <p className="text-center text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            Register assets, verify ownership on-chain, create programmable licenses,
            and receive automatic royalty payments — all powered by smart contracts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              id="hero-launch-btn"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold 
                px-8 py-3.5 rounded-xl hover:from-violet-500 hover:to-cyan-500 hover:shadow-xl 
                hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/[0.15] text-white/70 font-medium px-8 py-3.5 
                rounded-xl hover:bg-white/[0.05] hover:border-white/[0.25] hover:text-white transition-all"
            >
              View on GitHub <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6 flex justify-center w-full">
        <div className="w-full max-w-6xl flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-center text-white/40 max-w-xl mx-auto px-4">A complete platform for digital asset licensing, built on blockchain for trust and transparency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6
                hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02]
                transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 
                  flex items-center justify-center text-violet-400 mb-4 
                  group-hover:from-violet-500/30 group-hover:to-cyan-500/30 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-6 flex justify-center w-full">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-center text-white/40 px-4">Three simple steps to start licensing your digital assets.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-violet-500/30 to-transparent mb-4">
                  {s.num}
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-white/10">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="py-20 px-6 flex justify-center w-full">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="w-full bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-white/[0.08] rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="text-white/40 text-sm mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 flex justify-center w-full">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-4">Ready to Protect Your Assets?</h2>
          <p className="text-center text-white/40 mb-8 max-w-xl mx-auto px-4">
            Join creators who are already using Lumina to register, license, and monetize their digital work on the blockchain.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold
              px-10 py-4 rounded-xl hover:from-violet-500 hover:to-cyan-500 hover:shadow-xl 
              hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
          >
            Launch Lumina <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-[10px]">L</div>
            <span className="text-white/40 text-sm">Lumina — Built on Stellar</span>
          </div>
          <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Lumina. Open source under MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
