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
        title: "Sam Altman: OpenAI's Roadmap to AGI (Exclusive)",
        description: "A deep dive into the future of GPT-5, agentic workflows, and the timeline for Artificial General Intelligence.",
        thumbnailUrl: "https://i.ytimg.com/vi/jkq-9W8g_r4/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=jkq-9W8g_r4",
        source: "Y Combinator",
        publishedAt: "2025-11-28T10:00:00Z",
        duration: "45:20",
        views: "1.2M",
        category: "Interview"
    },
    {
        id: 'v2',
        title: "Google DeepMind's Gemini 2.0: Multimodal Breakthroughs",
        description: "Demis Hassabis demonstrates the new capabilities of Gemini 2.0 in reasoning, coding, and creative writing.",
        thumbnailUrl: "https://i.ytimg.com/vi/jV1vkHv4zq8/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=jV1vkHv4zq8",
        source: "Google DeepMind",
        publishedAt: "2025-11-30T14:30:00Z",
        duration: "12:15",
        views: "850K",
        category: "Demo"
    },
    {
        id: 'v3',
        title: "NVIDIA Keynote: The H200 Chip and the Future of Compute",
        description: "Jensen Huang reveals the hardware that will power the next generation of AI models.",
        thumbnailUrl: "https://i.ytimg.com/vi/Uo8i1_w4j4k/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Uo8i1_w4j4k",
        source: "NVIDIA",
        publishedAt: "2025-11-25T09:00:00Z",
        duration: "1:30:00",
        views: "2.5M",
        category: "Analysis"
    }
];

export const LIVE_VIDEOS: VideoItem[] = [
    {
        id: 'l1',
        title: "LIVE: SpaceX Starship Launch & Booster Catch Attempt",
        description: "Live coverage of the latest Starship integrated flight test from Starbase, Texas.",
        thumbnailUrl: "https://i.ytimg.com/vi/921VbMMAw80/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=921VbMMAw80",
        source: "SpaceX",
        publishedAt: "LIVE NOW",
        duration: "LIVE",
        views: "450K Watching",
        category: "Live"
    },
    {
        id: 'l2',
        title: "Tesla Optimus Gen 3: First Public Walkthrough",
        description: "Real-time demonstration of the new Optimus robot performing complex household tasks.",
        thumbnailUrl: "https://i.ytimg.com/vi/gV6hP9wpMW8/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=gV6hP9wpMW8",
        source: "Tesla",
        publishedAt: "2 hours ago",
        duration: "08:45",
        views: "120K",
        category: "Demo"
    },
    {
        id: 'l3',
        title: "Andrej Karpathy: LLM OS Explained",
        description: "New educational breakdown on how Large Language Models are becoming operating systems.",
        thumbnailUrl: "https://i.ytimg.com/vi/zjkBMFhNj_g/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        source: "Andrej Karpathy",
        publishedAt: "5 hours ago",
        duration: "42:00",
        views: "300K",
        category: "Analysis"
    },
    {
        id: 'l4',
        title: "Figure 02 Robot: Coffee Making Demo",
        description: "End-to-end neural network control demonstration of Figure 02 making coffee.",
        thumbnailUrl: "https://i.ytimg.com/vi/Sq1QZB5baNw/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Sq1QZB5baNw",
        source: "Figure",
        publishedAt: "1 day ago",
        duration: "02:30",
        views: "1.1M",
        category: "Demo"
    },
    {
        id: 'l5',
        title: "Microsoft Surface Event 2025: AI Integration",
        description: "Full recap of the new AI features integrated into Windows and Surface devices.",
        thumbnailUrl: "https://i.ytimg.com/vi/yH91h9tJ5p0/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=yH91h9tJ5p0",
        source: "Microsoft",
        publishedAt: "1 day ago",
        duration: "15:00",
        views: "600K",
        category: "Analysis"
    },
    {
        id: 'l6',
        title: "Boston Dynamics: Atlas 2.0 Parkour Update",
        description: "The latest robotics capabilities from Boston Dynamics showing unprecedented agility.",
        thumbnailUrl: "https://i.ytimg.com/vi/tF4DML7FIWk/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=tF4DML7FIWk",
        source: "Boston Dynamics",
        publishedAt: "2 days ago",
        duration: "03:45",
        views: "5.1M",
        category: "Demo"
    }
];
