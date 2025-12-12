import React from 'react';

interface ChannelCardProps {
    name: string;
    logo: string;
    group: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function ChannelCard({ name, logo, group, isActive, onClick }: ChannelCardProps) {
    return (
        <button
            onClick={onClick}
            data-active={isActive}
            className="w-full flex flex-col items-center gap-3 p-3 rounded-xl bg-[#1e204a]/70 hover:bg-[#2a2d65] transition-all border border-transparent data-[active=true]:border-blue-500 data-[active=true]:bg-blue-900/40 group relative overflow-hidden h-full"
        >
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />

            <div className="w-16 h-16 rounded-xl bg-[#0f0c29] flex items-center justify-center p-2 shadow-inner">
                {logo ? (
                    <img
                        src={logo}
                        alt={name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerText = 'TV';
                        }}
                    />
                ) : (
                    <span className="text-gray-500 font-bold">TV</span>
                )}
            </div>

            <div className="text-center w-full">
                <span className="block font-semibold text-gray-100 text-sm truncate w-full mb-1">{name}</span>
                <span className="block text-[10px] text-gray-400 truncate w-full group-hover:text-blue-300 transition-colors uppercase tracking-wider">{group}</span>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
    );
}
