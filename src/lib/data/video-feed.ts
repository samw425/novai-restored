export interface VideoItem {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    source: string;
    publishedAt: string;
    duration: string;
    views: string;
    category: 'Interview' | 'Demo' | 'Analysis' | 'Documentary' | 'Live' | 'Safety' | 'Launch';
    aiScore: number; // 0-100, used for 30-Day Brief filtering
    timestamp: number; // Unix timestamp for sorting
}

// THE MASTER DATABASE - VERIFIED, HIGH-SIGNAL VIDEOS ONLY
const MASTER_VIDEO_DB: VideoItem[] = [
    // --- LATEST RELEASES ---
    {
        id: 'o1-building',
        title: "Building OpenAI o1",
        description: "Deep dive into the reasoning capabilities of OpenAI's new o1 model series with the research team.",
        thumbnailUrl: "https://i.ytimg.com/vi/tEzs3VHyBDM/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=tEzs3VHyBDM",
        source: "OpenAI",
        publishedAt: "Sep 12, 2024",
        duration: "41:00",
        views: "1.2M",
        category: "Analysis",
        aiScore: 99,
        timestamp: 1726142400000 // Sep 12, 2024
    },
    {
        id: 'o1-coding',
        title: "Coding with OpenAI o1",
        description: "Demonstration of o1's advanced coding and problem-solving abilities in real-time.",
        thumbnailUrl: "https://i.ytimg.com/vi/50W4YeQdnSg/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=50W4YeQdnSg",
        source: "OpenAI",
        publishedAt: "Sep 12, 2024",
        duration: "15:30",
        views: "850K",
        category: "Demo",
        aiScore: 98,
        timestamp: 1726146000000 // Sep 12, 2024
    },
    {
        id: 'llama-3.2',
        title: "Llama 3.2: Open Source Multimodal",
        description: "Meta releases Llama 3.2, bringing vision capabilities to edge devices and open source models.",
        thumbnailUrl: "https://i.ytimg.com/vi/2JlmZ5dUIbg/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=2JlmZ5dUIbg",
        source: "Meta AI",
        publishedAt: "Sep 25, 2024",
        duration: "12:45",
        views: "450K",
        category: "Launch",
        aiScore: 97,
        timestamp: 1727265600000 // Sep 25, 2024
    },
    {
        id: 'claude-3.5',
        title: "Introducing Claude 3.5 Sonnet",
        description: "Anthropic's new model sets industry benchmarks for reasoning, coding, and nuance.",
        thumbnailUrl: "https://i.ytimg.com/vi/jqx18KgIzAE/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=jqx18KgIzAE",
        source: "Anthropic",
        publishedAt: "Jun 20, 2024",
        duration: "03:15",
        views: "2.1M",
        category: "Launch",
        aiScore: 97,
        timestamp: 1718884800000 // Jun 20, 2024
    },
    {
        id: 'gpt-4o',
        title: "GPT-4o Launch: Omni Model Demo",
        description: "First native multimodal model with real-time audio/visual reasoning capabilities.",
        thumbnailUrl: "https://i.ytimg.com/vi/DQacCB9tDaw/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=DQacCB9tDaw",
        source: "OpenAI",
        publishedAt: "May 13, 2024",
        duration: "25:00",
        views: "5.5M",
        category: "Demo",
        aiScore: 96,
        timestamp: 1715592000000 // May 13, 2024
    },
    {
        id: 'gemini-1.5',
        title: "Google Gemini 1.5 Pro: Long Context",
        description: "DeepMind showcases 1M+ token context window capabilities in Gemini 1.5 Pro.",
        thumbnailUrl: "https://i.ytimg.com/vi/LHKL_210CcU/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=LHKL_210CcU",
        source: "Google DeepMind",
        publishedAt: "Feb 15, 2024",
        duration: "12:30",
        views: "1.5M",
        category: "Launch",
        aiScore: 95,
        timestamp: 1707998400000 // Feb 15, 2024
    },
    {
        id: 'sora',
        title: "Introducing Sora — Text-to-Video",
        description: "OpenAI's groundbreaking video generation model that simulates physical world dynamics.",
        thumbnailUrl: "https://i.ytimg.com/vi/HK6y-0-22cE/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=HK6y-0-22cE",
        source: "OpenAI",
        publishedAt: "Feb 15, 2024",
        duration: "09:30",
        views: "12M",
        category: "Launch",
        aiScore: 99,
        timestamp: 1707998400000 // Feb 15, 2024
    },
    {
        id: 'nvidia-blackwell',
        title: "NVIDIA GTC 2024 Keynote",
        description: "Jensen Huang unveils the Blackwell platform, defining the next era of AI compute.",
        thumbnailUrl: "https://i.ytimg.com/vi/pKXDVsWZmUU/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=pKXDVsWZmUU",
        source: "NVIDIA",
        publishedAt: "Mar 18, 2024",
        duration: "2:02:00",
        views: "18M",
        category: "Analysis",
        aiScore: 95,
        timestamp: 1710763200000 // Mar 18, 2024
    },
    {
        id: 'figure-01',
        title: "Figure 01 + OpenAI | Speech-to-speech",
        description: "Humanoid robot Figure 01 demonstrating full conversation and task execution.",
        thumbnailUrl: "https://i.ytimg.com/vi/Sq1QZB5baNw/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Sq1QZB5baNw",
        source: "Figure",
        publishedAt: "Mar 13, 2024",
        duration: "02:35",
        views: "4.1M",
        category: "Demo",
        aiScore: 94,
        timestamp: 1710331200000 // Mar 13, 2024
    },
    {
        id: 'tesla-optimus',
        title: "Tesla Optimus Gen 2 Update",
        description: "New capabilities of Tesla's humanoid robot, including delicate object manipulation.",
        thumbnailUrl: "https://i.ytimg.com/vi/D2vj0WcvH5c/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=D2vj0WcvH5c",
        source: "Tesla",
        publishedAt: "Dec 13, 2023",
        duration: "01:45",
        views: "3.2M",
        category: "Demo",
        aiScore: 92,
        timestamp: 1702468800000 // Dec 13, 2023
    },
    {
        id: 'apple-intelligence',
        title: "Apple Intelligence | WWDC 2024",
        description: "Apple integrates generative AI across iPhone, iPad, and Mac with on-device privacy.",
        thumbnailUrl: "https://i.ytimg.com/vi/p2dhZ3AoDDs/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=p2dhZ3AoDDs",
        source: "Apple",
        publishedAt: "Jun 10, 2024",
        duration: "1:45:00",
        views: "15M",
        category: "Launch",
        aiScore: 93,
        timestamp: 1718020800000 // Jun 10, 2024
    },
    {
        id: 'starship-flight-5',
        title: "Starship Flight 5: The Catch",
        description: "SpaceX successfully catches the Super Heavy booster on the first attempt.",
        thumbnailUrl: "https://i.ytimg.com/vi/sSXTlR90h1c/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=sSXTlR90h1c",
        source: "SpaceX",
        publishedAt: "Oct 13, 2024",
        duration: "02:45",
        views: "15M",
        category: "Live",
        aiScore: 95,
        timestamp: 1728820800000 // Oct 13, 2024
    },
    {
        id: 'karpathy-llm-os',
        title: "Andrej Karpathy: LLM OS",
        description: "Andrej Karpathy explains the concept of Large Language Models as an Operating System.",
        thumbnailUrl: "https://i.ytimg.com/vi/zjkBMFhNj_g/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        source: "Andrej Karpathy",
        publishedAt: "4 days ago",
        duration: "45:00",
        views: "2.5M",
        category: "Analysis",
        aiScore: 94,
        timestamp: 1715644800000
    },
    {
        id: 'project-astra',
        title: "Google Project Astra: Real-time Multimodal AI",
        description: "Google's answer to GPT-4o: A universal AI agent that can see and understand the world.",
        thumbnailUrl: "https://i.ytimg.com/vi/XEzRZ35urlk/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=XEzRZ35urlk",
        source: "Google",
        publishedAt: "May 14, 2024",
        duration: "02:15",
        views: "3.2M",
        category: "Demo",
        aiScore: 93,
        timestamp: 1715644800000
    }
];

// --- FILTERING LOGIC ---

// Live Feed: Returns ALL videos, sorted by timestamp (newest first)
// NO DUPLICATES - Pure, verified feed.
export const getLiveFeed = (): VideoItem[] => {
    return [...MASTER_VIDEO_DB].sort((a, b) => b.timestamp - a.timestamp);
};

// 30-Day Brief: Returns Top Rated videos from the last 6 months (extended window for quality)
export const get30DayBrief = (): VideoItem[] => {
    // Extended window to 6 months to ensure we capture major launches like GPT-4o and Claude 3.5
    // even if they are slightly older than 30 days, as they are still the "current" SOTA.
    const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000);

    return MASTER_VIDEO_DB.filter(video =>
        video.aiScore >= 90 &&
        video.timestamp >= sixMonthsAgo
    ).sort((a, b) => b.aiScore - a.aiScore);
};

// Exports
export const LIVE_VIDEOS = getLiveFeed();
export const BRIEF_VIDEOS = get30DayBrief();
