import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://usenovai.live';
    const now = new Date();

    return [
        // Homepage - Highest priority
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },

        // Core Intelligence Feeds - High priority, real-time
        {
            url: `${baseUrl}/global-feed`,
            lastModified: now,
            changeFrequency: 'always',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/us-intel`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/war-room`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.95,
        },

        // Sector-Specific Pages - High priority
        {
            url: `${baseUrl}/ai`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/anti-trust`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/earnings`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/robotics`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/future-of-code`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/policy`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/llms`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/hacker`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/market-pulse`,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 0.8,
        },

        // Utility Pages
        {
            url: `${baseUrl}/signup`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/pro-waitlist`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/support`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },

        // Legal Pages
        {
            url: `${baseUrl}/legal/privacy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/legal/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}
