export interface Verdict {
    id: string;
    title: string;
    pillar: 'CINEMA' | 'TALK' | 'WATCH';
    verdict: 'STREAM' | 'SKIP';
    score: number;
    why: string;
    youtubeId: string;
    streamingOn: string[]; // ['netflix', 'hulu']
    streamingLinks: Record<string, string>; // { netflix: 'https://...' }
    redditPulse: { user: string; text: string }[];
    creator?: string; // For TALK/WATCH
    timestamp?: string; // For TALK/WATCH ("Skip to 42:00")
}
