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
    category: 'Interview' | 'Demo' | 'Analysis' | 'Documentary' | 'Live';
}

export const BRIEF_VIDEOS: VideoItem[] = [
    {
        id: 'v1',
        title: "Sam Altman: OpenAI, GPT-5, Sora, and the Future of AGI",
        description: "Lex Fridman Podcast #419. A deep dive into the future of GPT-5, agentic workflows, and the timeline for Artificial General Intelligence.",
        thumbnailUrl: "https://i.ytimg.com/vi/jvqFAi7vkBc/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=jvqFAi7vkBc",
        source: "Lex Fridman",
        publishedAt: "2024-03-18T10:00:00Z",
        duration: "2:05:20",
        views: "5.2M",
        category: "Interview"
    },
    {
        id: 'v2',
        title: "NVIDIA GTC 2024 Keynote with CEO Jensen Huang",
        description: "The defining moment for the AI hardware industry. Jensen Huang reveals the Blackwell platform.",
        thumbnailUrl: "https://i.ytimg.com/vi/Y2F8yisiS6E/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Y2F8yisiS6E",
        source: "NVIDIA",
        publishedAt: "2024-03-18T20:00:00Z",
        duration: "2:02:00",
        views: "18M",
        category: "Analysis"
    },
    {
        id: 'v3',
        title: "Gemini 1.5 Flash: Our fastest, most affordable model",
        description: "Google DeepMind demonstrates the new capabilities of Gemini 1.5 Flash in reasoning and multimodal processing.",
        thumbnailUrl: "https://i.ytimg.com/vi/4sIUx-5n40c/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=4sIUx-5n40c",
        source: "Google",
        publishedAt: "2024-05-14T17:00:00Z",
        duration: "03:15",
        views: "1.5M",
        category: "Demo"
    }
];

export const LIVE_VIDEOS: VideoItem[] = [
    {
        id: 'l1',
        title: "Starship's Fourth Flight Test",
        description: "SpaceX's Starship successfully completes its fourth flight test, demonstrating reusability capabilities.",
        thumbnailUrl: "https://i.ytimg.com/vi/SjpX-j892y0/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=SjpX-j892y0",
        source: "SpaceX",
        publishedAt: "LIVE REPLAY",
        duration: "02:15:00",
        views: "8.5M",
        category: "Live"
    },
    {
        id: 'l2',
        title: "Tesla Optimus Update: Gen 2 Capabilities",
        description: "Real-time demonstration of the new Optimus robot performing complex autonomous tasks.",
        thumbnailUrl: "https://i.ytimg.com/vi/D2vj0WcvH5c/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=D2vj0WcvH5c",
        source: "Tesla",
        publishedAt: "2 days ago",
        duration: "01:45",
        views: "3.2M",
        category: "Demo"
    },
    {
        id: 'l3',
        title: "Figure 01 + OpenAI | Speech-to-speech reasoning",
        description: "The viral demonstration of Figure 01 having a full conversation and performing tasks using OpenAI models.",
        thumbnailUrl: "https://i.ytimg.com/vi/Sq1QZB5baNw/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Sq1QZB5baNw",
        source: "Figure",
        publishedAt: "1 week ago",
        duration: "02:35",
        views: "4.1M",
        category: "Demo"
    },
    {
        id: 'l4',
        title: "All New Atlas | Boston Dynamics",
        description: "The next generation of the Atlas robot is fully electric and stronger than ever.",
        thumbnailUrl: "https://i.ytimg.com/vi/29ECwExc-_M/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=29ECwExc-_M",
        source: "Boston Dynamics",
        publishedAt: "3 weeks ago",
        duration: "00:40",
        views: "7.8M",
        category: "Demo"
    },
    {
        id: 'l5',
        title: "GPT-4o Launch: Omni Model Demo",
        description: "OpenAI demonstrates the new GPT-4o model with real-time voice and vision capabilities.",
        thumbnailUrl: "https://i.ytimg.com/vi/DQacCB9tDaw/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=DQacCB9tDaw",
        source: "OpenAI",
        publishedAt: "1 month ago",
        duration: "25:00",
        views: "5.5M",
        category: "Demo"
    }
];
