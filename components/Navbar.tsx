"use client";

import React from 'react';
import { Sun, Globe } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="p-6 flex justify-end gap-4 relative z-20">
            <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 backdrop-blur-sm group">
                <Sun className="w-5 h-5 text-yellow-500/80 group-hover:text-yellow-400 transition-colors" />
            </button>
            <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 backdrop-blur-sm group">
                <Globe className="w-5 h-5 text-blue-400/80 group-hover:text-blue-300 transition-colors" />
            </button>
        </nav>
    );
}
