import { parse } from 'iptv-playlist-parser';

export interface Channel {
  id: string;
  name: string;
  group: string;
  logo: string;
  url: string;
  raw: any;
}

export interface Playlist {
  channels: Channel[];
  groups: string[];
}

export async function fetchPlaylist(url: string): Promise<Playlist> {
  try {
    let response;

    // 1. Try direct fetch first (GitHub Pages usually supports CORS)
    try {
      response = await fetch(url);
    } catch (err) {
      console.warn('Direct fetch failed, trying proxy...', err);
    }

    // 2. If direct fetch failed (network/CORS) or returned error, try proxy
    if (!response || !response.ok) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      response = await fetch(proxyUrl);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText} (${response.status})`);
    }

    const text = await response.text();
    const parsed = parse(text);

    const channels: Channel[] = parsed.items.map((item, index) => ({
      id: item.tvg.id || `ch-${index}`,
      name: item.name,
      group: item.group.title || 'Uncategorized',
      logo: item.tvg.logo || '',
      url: item.url,
      raw: item,
    }));

    const groups = Array.from(new Set(channels.map((c) => c.group))).sort();

    return { channels, groups };
  } catch (error) {
    console.error('Error fetching playlist:', error);
    // Return empty playlist instead of crashing
    return { channels: [], groups: [] };
  }
}
