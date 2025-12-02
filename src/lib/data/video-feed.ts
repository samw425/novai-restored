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
    category: 'Interview' | 'Demo' | 'Analysis' | 'Documentary';
}

export const VIDEO_FEED_DATA: VideoItem[] = [
    {
        id: 'v1',
        title: "Sam Altman: OpenAI's Roadmap to AGI (Exclusive)",
        description: "A deep dive into the future of GPT-5, agentic workflows, and the timeline for Artificial General Intelligence.",
        thumbnailUrl: "https://i.ytimg.com/vi/jkq-9W8g_r4/maxresdefault.jpg", // Placeholder, will need real ones or generic
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
    },
    {
        id: 'v4',
        title: "The State of AI Agents: From Chatbots to Workers",
        description: "An analysis of how autonomous agents are transforming the workforce in 2025.",
        thumbnailUrl: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        source: "3Blue1Brown",
        publishedAt: "2025-12-01T08:00:00Z",
        duration: "22:10",
        views: "500K",
        category: "Analysis"
    },
    {
        id: 'v5',
        title: "Boston Dynamics: Atlas 2.0 Parkour Update",
        description: "The latest robotics capabilities from Boston Dynamics showing unprecedented agility.",
        thumbnailUrl: "https://i.ytimg.com/vi/tF4DML7FIWk/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=tF4DML7FIWk",
        source: "Boston Dynamics",
        publishedAt: "2025-11-29T16:45:00Z",
        duration: "03:45",
        views: "5.1M",
        category: "Demo"
    },
    {
        id: 'v6',
        title: "Ilya Sutskever: What We Learned Building SSI",
        description: "Safe Superintelligence Inc.'s co-founder discusses the safety challenges of superintelligence.",
        thumbnailUrl: "https://i.ytimg.com/vi/SEkKLk2_Vjo/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=SEkKLk2_Vjo",
        source: "Stanford Online",
        publishedAt: "2025-11-20T11:00:00Z",
        duration: "55:00",
        views: "900K",
        category: "Interview"
    }
];
