import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full bg-[#0a0a1f]/80 backdrop-blur-md border-t border-white/5 py-10 px-8 mt-auto z-10 relative">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-blue-200/60">
                <div className="text-center md:text-left space-y-1">
                    <p>
                        <span className="font-bold text-white tracking-wide">IPTVMADJID</span>
                        <span className="mx-2 text-white/20">|</span>
                        © 2025. Tous droits réservés
                    </p>
                    <p className="text-xs text-blue-300/40 font-light">
                        Développé par <span className="text-blue-300/60">Madjid</span> with <span className="text-red-500/80">❤️</span>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    <a href="#" className="hover:text-white hover:underline decoration-orange-500/50 underline-offset-4 transition-all duration-300 text-xs uppercase tracking-wider font-medium">Mentions Légales</a>
                    <a href="#" className="hover:text-white hover:underline decoration-orange-500/50 underline-offset-4 transition-all duration-300 text-xs uppercase tracking-wider font-medium">Politique de Confidentialité</a>
                    <a href="#" className="hover:text-white hover:underline decoration-orange-500/50 underline-offset-4 transition-all duration-300 text-xs uppercase tracking-wider font-medium">CGU</a>
                </div>
            </div>
        </footer>
    );
}
