/**
 * Client-Side Property Cache
 * Reduces API calls and improves perceived performance
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

const CACHE_KEY_PREFIX = 'zenith_cache_';
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class PropertyCache {
    /**
     * Get cached data if valid
     */
    static get<T>(key: string): T | null {
        try {
            const raw = localStorage.getItem(CACHE_KEY_PREFIX + key);
            if (!raw) return null;

            const entry: CacheEntry<T> = JSON.parse(raw);
            const now = Date.now();

            if (now - entry.timestamp > entry.ttl) {
                localStorage.removeItem(CACHE_KEY_PREFIX + key);
                return null;
            }

            return entry.data;
        } catch {
            return null;
        }
    }

    /**
     * Set cached data with TTL
     */
    static set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
        try {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
                ttl: ttlMs
            };
            localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(entry));
        } catch (e) {
            console.warn('[CACHE] Storage failed:', e);
        }
    }

    /**
     * Generate cache key from search parameters
     */
    static generateKey(location: string, bounds?: any): string {
        const base = location.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
        if (bounds) {
            return `${base}_${bounds.latMin?.toFixed(2)}_${bounds.lngMin?.toFixed(2)}`;
        }
        return base;
    }

    /**
     * Clear all zenith cache entries
     */
    static clearAll(): void {
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
            keys.forEach(k => localStorage.removeItem(k));
        } catch {
            // Ignore
        }
    }

    /**
     * Get cache statistics
     */
    static getStats(): { entries: number; sizeBytes: number } {
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
            let sizeBytes = 0;
            keys.forEach(k => {
                const item = localStorage.getItem(k);
                if (item) sizeBytes += item.length * 2; // UTF-16
            });
            return { entries: keys.length, sizeBytes };
        } catch {
            return { entries: 0, sizeBytes: 0 };
        }
    }
}

/**
 * Skip trace result cache (longer TTL - 90 days)
 */
export class SkipTraceCache {
    private static CACHE_KEY = 'zenith_skip_trace_cache';
    private static TTL_DAYS = 90;

    static get(propertyId: string): any | null {
        try {
            const raw = localStorage.getItem(this.CACHE_KEY);
            if (!raw) return null;

            const cache: Record<string, { data: any; timestamp: number }> = JSON.parse(raw);
            const entry = cache[propertyId];

            if (!entry) return null;

            const daysSinceCache = (Date.now() - entry.timestamp) / (1000 * 60 * 60 * 24);
            if (daysSinceCache > this.TTL_DAYS) {
                delete cache[propertyId];
                localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
                return null;
            }

            return entry.data;
        } catch {
            return null;
        }
    }

    static set(propertyId: string, data: any): void {
        try {
            const raw = localStorage.getItem(this.CACHE_KEY);
            const cache: Record<string, { data: any; timestamp: number }> = raw ? JSON.parse(raw) : {};

            cache[propertyId] = {
                data,
                timestamp: Date.now()
            };

            localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.warn('[SkipTraceCache] Storage failed:', e);
        }
    }
}
