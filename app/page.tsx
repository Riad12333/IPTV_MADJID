import React from 'react';
import Link from 'next/link';
import { Tv, Play, Globe, Smartphone, AlertTriangle } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0c29] text-white flex flex-col font-sans selection:bg-orange-500/30 overflow-x-hidden">

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c4b] via-[#101135] to-[#0a0a1f]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      <Navbar />

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:-mt-10 relative z-10 w-full max-w-7xl mx-auto pt-20">

        {/* Logo */}
        <div className="mb-6 md:mb-10 relative group perspective-1000">
          <div className="absolute inset-0 bg-orange-600/30 blur-3xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="w-32 h-32 rounded-[2rem] bg-[#0f0c29] border border-white/10 flex flex-col items-center justify-center relative z-10 shadow-2xl transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-100" />
            <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-orange-500/20">
              <Play className="w-10 h-10 text-white fill-current ml-1" />
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-2 bg-black/50 blur-lg rounded-full" />
        </div>

        {/* Title */}
        <div className="text-center space-y-3 md:space-y-5 mb-10 md:mb-20 relative z-10 max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Bienvenue sur <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600 drop-shadow-sm">IPTVMADJID</span>
          </h1>
          <p className="text-blue-100/70 text-base sm:text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            L'expérience de streaming ultime. Accédez à vos contenus préférés en haute définition, partout dans le monde.
          </p>
        </div>

        {/* Grid Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mb-20 px-4">
          <FeatureCard
            icon={<Tv className="w-9 h-9 text-orange-400" />}
            title="Chaînes TV"
            desc="Plus de 10 000 chaînes en direct du monde entier."
          />
          <FeatureCard
            icon={<Play className="w-9 h-9 text-red-500" />}
            title="Streaming HD"
            desc="Qualité 4K et Full HD sans mise en mémoire tampon."
          />
          <FeatureCard
            icon={<Globe className="w-9 h-9 text-blue-500" />}
            title="Multi-langues"
            desc="Contenus disponibles en FR, EN, AR, ES et plus."
          />
          <FeatureCard
            icon={<Smartphone className="w-9 h-9 text-yellow-500" />}
            title="Multi-appareils"
            desc="Compatible Smart TV, Android, iOS et PC."
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-16 px-4">
          <StatCard number="+350" label="Sports" color="from-orange-400 to-orange-600" />
          <StatCard number="+600" label="Divertissement" color="from-pink-400 to-pink-600" />
          <StatCard number="TNT" label="Chaînes France" color="from-blue-400 to-blue-600" />
          <StatCard number="VO" label="Internationale" color="from-purple-400 to-purple-600" />
        </div>

        {/* CTA Button */}
        <div className="relative group mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <Link
            href="/player"
            className="relative px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full leading-none flex items-center gap-4 shadow-2xl shadow-orange-900/20 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] ring-1 ring-white/20"
          >
            <span className="font-bold text-xl text-white tracking-wide">Accéder à l'interface IPTV</span>
            <span className="bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Play className="w-5 h-5 fill-current text-white" />
            </span>
          </Link>
        </div>

        {/* Warning Box */}
        <div className="max-w-2xl w-full bg-[#131538]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500/50" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
            <div className="flex-shrink-0 bg-yellow-500/10 p-3 rounded-xl text-yellow-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-yellow-400 font-bold text-base mb-1">Avertissement Important</h3>
              <p className="text-sm text-blue-200/50 leading-relaxed font-light">
                Cette application est un lecteur multimédia. Nous fournissons uniquement l'interface technique. Les flux proviennent de sources publiques tierces (IPTV-Org).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#1a1c4b]/40 backdrop-blur-sm border border-white/5 p-6 md:p-8 rounded-[2rem] hover:bg-[#1a1c4b]/80 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="mb-6 p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-sm text-blue-200/50 leading-relaxed font-light group-hover:text-blue-200/70 transition-colors">{desc}</p>
    </div>
  );
}

function StatCard({ number, label, color }: { number: string, label: string, color: string }) {
  return (
    <div className="bg-[#1a1c4b]/40 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-[#1a1c4b]/60">
      <div className={`text-3xl lg:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br ${color} mb-2 tracking-tight`}>
        {number}
      </div>
      <div className="text-[10px] md:text-xs text-blue-300/40 font-bold uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}
