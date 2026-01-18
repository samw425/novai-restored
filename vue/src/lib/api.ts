// VUE API Service - Live Data from TMDB
// Using TMDB's free API for movies/TV metadata

// TMDB v3 API Key
const TMDB_API_KEY = 'dbfa530b6ca0efec4f4f8cf1d0a6716a';
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Platform IDs for TMDB watch providers
export const PLATFORMS = {
    netflix: { id: 8, name: 'Netflix', color: '#E50914' },
    prime: { id: 9, name: 'Prime Video', color: '#00A8E1' },
    disney: { id: 337, name: 'Disney+', color: '#113CCF' },
    max: { id: 1899, name: 'Max', color: '#741DFF' },
    hulu: { id: 15, name: 'Hulu', color: '#1CE783' },
    apple: { id: 350, name: 'Apple TV+', color: '#000000' },
    paramount: { id: 531, name: 'Paramount+', color: '#0064FF' },
    peacock: { id: 386, name: 'Peacock', color: '#000000' },
    youtube: { id: 192, name: 'YouTube', color: '#FF0000' },
    tubi: { id: 73, name: 'Tubi', color: '#FA382F' },
} as const;

export type PlatformKey = keyof typeof PLATFORMS;

export interface ContentItem {
    id: number;
    title: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    vote_count: number;
    release_date?: string;
    first_air_date?: string;
    media_type: 'movie' | 'tv';
    genre_ids: number[];
}

export interface YouTubeVideo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnail: string;
    viewCount: string;
    publishedAt: string;
    categoryId: string;
}

// Helper to build URL with API key
function tmdbUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = new URL(`${TMDB_BASE}${endpoint}`);
    url.searchParams.set('api_key', TMDB_API_KEY);
    url.searchParams.set('language', 'en-US');
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    return url.toString();
}

// Fetch trending content (movies + TV)
export async function getTrending(): Promise<ContentItem[]> {
    try {
        const res = await fetch(tmdbUrl('/trending/all/day'));
        const data = await res.json();
        return data.results || [];
    } catch (e) {
        console.error('Failed to fetch trending:', e);
        return [];
    }
}

// Fetch movies now playing in theaters
export async function getNowPlaying(): Promise<ContentItem[]> {
    try {
        const res = await fetch(tmdbUrl('/movie/now_playing'));
        const data = await res.json();
        return (data.results || []).map((m: any) => ({ ...m, media_type: 'movie' }));
    } catch (e) {
        console.error('Failed to fetch now playing:', e);
        return [];
    }
}

// Fetch popular TV shows
export async function getPopularTV(): Promise<ContentItem[]> {
    try {
        const res = await fetch(tmdbUrl('/tv/popular'));
        const data = await res.json();
        return (data.results || []).map((m: any) => ({ ...m, media_type: 'tv' }));
    } catch (e) {
        console.error('Failed to fetch popular TV:', e);
        return [];
    }
}

// Fetch top rated movies
export async function getTopRated(): Promise<ContentItem[]> {
    try {
        const res = await fetch(tmdbUrl('/movie/top_rated'));
        const data = await res.json();
        return (data.results || []).map((m: any) => ({ ...m, media_type: 'movie' }));
    } catch (e) {
        console.error('Failed to fetch top rated:', e);
        return [];
    }
}

// Fetch content by platform
export async function getByPlatform(platform: PlatformKey, type: 'movie' | 'tv' = 'movie'): Promise<ContentItem[]> {
    try {
        const providerId = PLATFORMS[platform].id;
        const res = await fetch(tmdbUrl(`/discover/${type}`, {
            with_watch_providers: providerId.toString(),
            watch_region: 'US',
            sort_by: 'popularity.desc'
        }));
        const data = await res.json();
        return (data.results || []).map((m: any) => ({ ...m, media_type: type }));
    } catch (e) {
        console.error(`Failed to fetch ${platform} content:`, e);
        return [];
    }
}

// Fetch movie/TV details
export async function getDetails(id: number, type: 'movie' | 'tv'): Promise<any> {
    try {
        const res = await fetch(tmdbUrl(`/${type}/${id}`, {
            append_to_response: 'videos,credits,watch/providers'
        }));
        return await res.json();
    } catch (e) {
        console.error('Failed to fetch details:', e);
        return null;
    }
}

// Search across movies and TV
export async function searchContent(query: string): Promise<ContentItem[]> {
    try {
        const res = await fetch(tmdbUrl('/search/multi', { query }));
        const data = await res.json();
        return (data.results || []).filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv');
    } catch (e) {
        console.error('Failed to search:', e);
        return [];
    }
}

// Generate VUE Verdict based on score
export function getVerdict(score: number): { verdict: 'WATCH' | 'PASS'; color: string } {
    if (score >= 7.0) return { verdict: 'WATCH', color: '#DC2626' };
    return { verdict: 'PASS', color: '#6B7280' };
}

// Image URL helper
export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
