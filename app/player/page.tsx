"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Search, Tv, Menu, X, Globe, Grid, List as ListIcon, History, Star, Home, ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { fetchPlaylist, Playlist, Channel } from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import ChannelCard from '@/components/ChannelCard';

// Default playlists
const PRESETS = [
    { name: '🇫🇷 France', url: 'https://iptv-org.github.io/iptv/countries/fr.m3u' },
    { name: '🇩🇿 Algeria', url: 'https://iptv-org.github.io/iptv/countries/dz.m3u' },
    { name: '🇺🇸 USA', url: 'https://iptv-org.github.io/iptv/countries/us.m3u' },
    { name: '⚽ Football', url: 'https://iptv-org.github.io/iptv/categories/football.m3u' },
    { name: '🏎️ Auto/Moto', url: 'https://iptv-org.github.io/iptv/categories/auto.m3u' },
    { name: '🥊 Sports Combat', url: 'https://iptv-org.github.io/iptv/categories/fight.m3u' },
    { name: '🏀 Sports Divers', url: 'https://iptv-org.github.io/iptv/categories/sports.m3u' },
    { name: '🎬 Movies', url: 'https://iptv-org.github.io/iptv/categories/movies.m3u' },
    { name: 'General', url: 'https://iptv-org.github.io/iptv/index.m3u' },
];

export default function PlayerPage() {
    const [playlistUrl, setPlaylistUrl] = useState<string | string[]>('https://iptv-org.github.io/iptv/countries/fr.m3u'); // Default to France
    const [playlist, setPlaylist] = useState<Playlist>({ channels: [], groups: [] });
    const [loading, setLoading] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
    const [customUrl, setCustomUrl] = useState('');
    const itemsPerPage = 24;

    useEffect(() => {
        loadPlaylist(playlistUrl);
    }, [playlistUrl]);

    // Close sidebar on mobile on initial load
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, []);

    const closeMobileSidebar = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const loadPlaylist = async (urlOrUrls: string | string[]) => {
        setLoading(true);
        setSelectedChannel(null); // Reset player
        try {
            let data: Playlist;
            if (Array.isArray(urlOrUrls)) {
                // Fetch multiple playlists and merge
                const results = await Promise.all(
                    urlOrUrls.map(url => fetchPlaylist(url).catch(e => ({ channels: [], groups: [] })))
                );

                // Merge channels and groups
                const allChannels = results.flatMap(r => r.channels);
                const allGroups = Array.from(new Set(results.flatMap(r => r.groups))).sort();

                // Deduplicate channels based on ID or URL
                const uniqueChannelsMap = new Map();
                allChannels.forEach(c => {
                    if (!uniqueChannelsMap.has(c.url)) {
                        uniqueChannelsMap.set(c.url, c);
                    }
                });

                data = {
                    channels: Array.from(uniqueChannelsMap.values()),
                    groups: allGroups
                };
            } else {
                data = await fetchPlaylist(urlOrUrls);
            }
            setPlaylist(data);
        } catch (e) {
            console.error(e);
            // Optionally handle error UI here
        } finally {
            setLoading(false);
        }
    };

    const [savedPlaylists, setSavedPlaylists] = useState<{ name: string, url: string }[]>([]);
    const [customName, setCustomName] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('iptv_saved_playlists');
        if (saved) {
            try {
                setSavedPlaylists(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved playlists');
            }
        }
    }, []);

    const savePlaylist = (name: string, url: string) => {
        const newPlaylists = [...savedPlaylists, { name, url }];
        setSavedPlaylists(newPlaylists);
        localStorage.setItem('iptv_saved_playlists', JSON.stringify(newPlaylists));
    };

    const deletePlaylist = (index: number) => {
        const newPlaylists = savedPlaylists.filter((_, i) => i !== index);
        setSavedPlaylists(newPlaylists);
        localStorage.setItem('iptv_saved_playlists', JSON.stringify(newPlaylists));
    };

    const handleCustomUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customUrl.trim()) {
            const name = customName.trim() || `Playlist ${savedPlaylists.length + 1}`;
            savePlaylist(name, customUrl);
            setPlaylistUrl(customUrl);
            setCustomUrl('');
            setCustomName('');
            setShowCustomUrlInput(false);
            closeMobileSidebar();
        }
    };

    const filteredChannels = useMemo(() => {
        return playlist.channels.filter((c) => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGroup = selectedGroup === 'All' || c.group === selectedGroup;
            return matchesSearch && matchesGroup;
        });
    }, [playlist.channels, searchQuery, selectedGroup]);

    // Pagination logic
    const totalPages = Math.ceil(filteredChannels.length / itemsPerPage);
    const currentChannels = filteredChannels.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedGroup]);

    return (
        <div className="flex h-screen bg-[#0f0c29] text-gray-100 overflow-hidden font-sans">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-10 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                ${isSidebarOpen ? 'w-64' : 'w-0'} 
                bg-[#131538] border-r border-[#2d306b] transition-all duration-300 flex flex-col z-20 absolute md:relative h-full
            `}>
                <div className="p-5 border-b border-[#2d306b] flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
                        <Tv className="w-4 h-4 text-white" />
                    </div>
                    <div className={`font-bold text-lg overflow-hidden whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        IPTV Player
                    </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${!isSidebarOpen && 'hidden'}`}>

                    {/* Main Nav */}
                    <div className="space-y-1">
                        <button onClick={() => { setSelectedGroup('All'); setSearchQuery(''); closeMobileSidebar(); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${selectedGroup === 'All' && searchQuery === '' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-[#1e204a]'}`}>
                            <Home className="w-5 h-5" />
                            <span className="text-sm font-medium">Toutes les chaînes</span>
                        </button>
                    </div>

                    {/* Custom Playlists Section */}
                    {savedPlaylists.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Mes Playlists</h3>
                            <div className="space-y-1">
                                {savedPlaylists.map((playlist, idx) => (
                                    <div key={idx} className="group flex items-center gap-1">
                                        <button
                                            onClick={() => { setPlaylistUrl(playlist.url); setSearchQuery(''); closeMobileSidebar(); }}
                                            className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left overflow-hidden ${playlistUrl === playlist.url ? 'bg-[#1e204a] text-green-400 border-r-2 border-green-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                                        >
                                            <ListIcon className="w-3 h-3 flex-shrink-0" />
                                            <span className="text-xs truncate">{playlist.name}</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deletePlaylist(idx); }}
                                            className="p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pack Sports (Legal) */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            Pack Sports
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => {
                                    setPlaylistUrl([
                                        'https://iptv-org.github.io/iptv/categories/sports.m3u',
                                        'https://iptv-org.github.io/iptv/countries/qa.m3u',
                                        'https://iptv-org.github.io/iptv/countries/fr.m3u',
                                        'https://iptv-org.github.io/iptv/countries/tr.m3u',
                                        'https://iptv-org.github.io/iptv/countries/us.m3u',
                                        'https://iptv-org.github.io/iptv/countries/sa.m3u',
                                        'https://iptv-org.github.io/iptv/countries/ae.m3u',
                                        'https://raw.githubusercontent.com/hemzaberkane/ARAB-IPTV/main/ARABIPTV.m3u'
                                    ]);
                                    setSearchQuery('bein');
                                    closeMobileSidebar();
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${Array.isArray(playlistUrl) && searchQuery === 'bein' ? 'bg-[#1e204a] text-purple-400 border-r-2 border-purple-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                            >
                                <span className="text-lg">📺</span>
                                <span className="text-sm">Bein Sports (All)</span>
                            </button>
                            <button
                                onClick={() => { setPlaylistUrl('https://iptv-org.github.io/iptv/categories/sports.m3u'); setSearchQuery(''); closeMobileSidebar(); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${playlistUrl === 'https://iptv-org.github.io/iptv/categories/sports.m3u' && searchQuery === '' ? 'bg-[#1e204a] text-orange-400 border-r-2 border-orange-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                            >
                                <span className="text-lg">🏆</span>
                                <span className="text-sm">Sports Global</span>
                            </button>
                            <button
                                onClick={() => { setPlaylistUrl('https://iptv-org.github.io/iptv/categories/football.m3u'); setSearchQuery(''); closeMobileSidebar(); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${playlistUrl === 'https://iptv-org.github.io/iptv/categories/football.m3u' ? 'bg-[#1e204a] text-orange-400 border-r-2 border-orange-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                            >
                                <span className="text-lg">⚽</span>
                                <span className="text-sm">Football</span>
                            </button>
                            <button
                                onClick={() => { setPlaylistUrl('https://iptv-org.github.io/iptv/categories/auto.m3u'); setSearchQuery(''); closeMobileSidebar(); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${playlistUrl === 'https://iptv-org.github.io/iptv/categories/auto.m3u' ? 'bg-[#1e204a] text-orange-400 border-r-2 border-orange-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                            >
                                <span className="text-lg">🏎️</span>
                                <span className="text-sm">Auto/Moto</span>
                            </button>
                            <button
                                onClick={() => { setPlaylistUrl('https://iptv-org.github.io/iptv/categories/fight.m3u'); setSearchQuery(''); closeMobileSidebar(); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${playlistUrl === 'https://iptv-org.github.io/iptv/categories/fight.m3u' ? 'bg-[#1e204a] text-orange-400 border-r-2 border-orange-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                            >
                                <span className="text-lg">🥊</span>
                                <span className="text-sm">Sports Combat</span>
                            </button>
                            <button
                                onClick={() => { setPlaylistUrl('https://iptv-org.github.io/iptv/categories/extreme_sports.m3u'); setSearchQuery(''); closeMobileSidebar(); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${playlistUrl === 'https://iptv-org.github.io/iptv/categories/extreme_sports.m3u' ? 'bg-[#1e204a] text-orange-400 border-r-2 border-orange-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                            >
                                <span className="text-lg">🛹</span>
                                <span className="text-sm">Extreme Sports</span>
                            </button>
                        </div>
                    </div>

                    {/* Sources / Countries */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sources</h3>
                            <button
                                onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Ajouter une playlist personnalisée"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {showCustomUrlInput && (
                            <form onSubmit={handleCustomUrlSubmit} className="mb-3 px-2 animate-fade-in bg-[#0a0a1f] p-3 rounded-xl border border-blue-500/30">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Nom (ex: Ma Liste)"
                                        className="w-full bg-[#131538] text-xs p-2 rounded border border-[#2d306b] focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                                        value={customName}
                                        onChange={e => setCustomName(e.target.value)}
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full bg-[#131538] text-xs p-2 rounded border border-[#2d306b] focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                                        value={customUrl}
                                        onChange={e => setCustomUrl(e.target.value)}
                                    />
                                    <button type="submit" className="w-full bg-blue-600 text-xs py-2 rounded-lg hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20">
                                        Sauvegarder
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-1">
                            {PRESETS.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => { setPlaylistUrl(p.url); setSearchQuery(''); closeMobileSidebar(); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${playlistUrl === p.url ? 'bg-[#1e204a] text-blue-400 border-r-2 border-blue-400' : 'text-gray-400 hover:bg-[#1e204a]'}`}
                                >
                                    <Globe className="w-3 h-3" />
                                    <span className="text-xs">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégories</h3>
                            <span className="bg-[#2d306b] text-[10px] px-1.5 py-0.5 rounded text-gray-300">{playlist.groups.length}</span>
                        </div>
                        <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900 pr-1">
                            {playlist.groups.map(g => (
                                <button
                                    key={g}
                                    onClick={() => { setSelectedGroup(g); closeMobileSidebar(); }}
                                    className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center justify-between group ${selectedGroup === g ? 'text-blue-400 bg-[#1e204a]' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <span className="truncate">{g}</span>
                                    {selectedGroup === g && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0f0c29]">

                {/* Header */}
                <header className="h-16 border-b border-[#2d306b] bg-[#131538]/50 backdrop-blur flex items-center justify-between px-4 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-[#1e204a] rounded-lg text-gray-400 transition-colors">
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h2 className="font-bold text-lg hidden md:block text-white">IPTV Player</h2>
                    </div>

                    <div className="flex-1 max-w-xl mx-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Rechercher une chaîne..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0a0a1f] border border-[#2d306b] rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-1 bg-[#0a0a1f] p-1 rounded-lg border border-[#2d306b]">
                            <button className="p-1.5 bg-[#2d306b] rounded text-white">
                                <Grid className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-white">
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="px-3 py-1.5 bg-[#0a0a1f] rounded-lg border border-[#2d306b] text-xs text-gray-400 whitespace-nowrap">
                            {filteredChannels.length} chaînes
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6" id="scroll-container">

                    {/* Video Player (Sticky or Top) */}
                    {selectedChannel && (
                        <div className="mb-8 animate-fade-in">
                            <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl border border-[#2d306b] relative">
                                <VideoPlayer url={selectedChannel.url} autoPlay={true} />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="px-2 py-1 bg-red-600 rounded text-xs font-bold shadow-lg animate-pulse text-white">LIVE</span>
                                </div>
                            </div>
                            <div className="max-w-4xl mx-auto mt-4 flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{selectedChannel.name}</h1>
                                    <p className="text-gray-400 text-sm">{selectedChannel.group}</p>
                                </div>
                                <button onClick={() => setSelectedChannel(null)} className="text-sm text-gray-500 hover:text-white transition-colors">
                                    Fermer le lecteur
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Channels Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="aspect-square bg-[#1e204a] rounded-xl" />
                            ))}
                        </div>
                    ) : filteredChannels.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {currentChannels.map((channel) => (
                                    <div key={channel.id} className="h-40">
                                        <ChannelCard
                                            name={channel.name}
                                            logo={channel.logo}
                                            group={channel.group}
                                            isActive={selectedChannel?.id === channel.id}
                                            onClick={() => setSelectedChannel(channel)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-[#1e204a] hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-[#1e204a] transition-colors text-white"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-sm text-gray-400">
                                        Page <span className="text-white font-bold">{currentPage}</span> sur {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-[#1e204a] hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-[#1e204a] transition-colors text-white"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Tv className="w-16 h-16 mb-4 opacity-20" />
                            <p>Aucune chaîne trouvée</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
