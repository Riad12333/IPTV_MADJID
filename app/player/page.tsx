import { fetchPlaylist, Playlist } from '@/lib/api';
import PlayerClient from '@/components/PlayerClient';

export default async function PlayerPage() {
    const defaultUrl = 'https://iptv-org.github.io/iptv/countries/fr.m3u';
    let initialPlaylist: Playlist = { channels: [], groups: [] };

    try {
        // Fetch on server to ensure content is present even without JS
        initialPlaylist = await fetchPlaylist(defaultUrl);
    } catch (e) {
        console.error("Failed to fetch initial playlist on server:", e);
    }

    return <PlayerClient initialPlaylist={initialPlaylist} />;
}
