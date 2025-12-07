export interface LLMModel {
    id: string;
    name: string;
    provider: string;
    releaseDate: string;
    contextWindow: number; // in K tokens
    inputPrice: number; // per 1M tokens
    outputPrice: number; // per 1M tokens
    mmlu: number; // Benchmark score
    math: number; // GSM8K or similar
    code: number; // HumanEval or similar
    status: 'SOTA' | 'COMPETITIVE' | 'LEGACY';
    type: 'Proprietary' | 'Open Source';
}

export const LLM_BENCHMARKS: LLMModel[] = [
    {
        id: 'gpt-5-orion',
        name: 'GPT-5 (Orion)',
        provider: 'OpenAI',
        releaseDate: '2025-11-14',
        contextWindow: 1000, // 1M tokens
        inputPrice: 10.00,
        outputPrice: 30.00,
        mmlu: 96.4,
        math: 98.2,
        code: 97.5,
        status: 'SOTA',
        type: 'Proprietary'
    },
    {
        id: 'gemini-3-ultra',
        name: 'Gemini 3.0 Ultra',
        provider: 'Google',
        releaseDate: '2025-10-02',
        contextWindow: 10000, // 10M tokens
        inputPrice: 5.00,
        outputPrice: 15.00,
        mmlu: 95.8,
        math: 97.1,
        code: 96.0,
        status: 'SOTA',
        type: 'Proprietary'
    },
    {
        id: 'claude-4-opus',
        name: 'Claude 4 Opus',
        provider: 'Anthropic',
        releaseDate: '2025-09-15',
        contextWindow: 500,
        inputPrice: 15.00,
        outputPrice: 45.00,
        mmlu: 95.5,
        math: 96.8,
        code: 98.1, // Best at coding
        status: 'SOTA',
        type: 'Proprietary'
    },
    {
        id: 'grok-4',
        name: 'Grok-4 (Supercluster)',
        provider: 'xAI',
        releaseDate: '2025-11-30',
        contextWindow: 256,
        inputPrice: 2.00,
        outputPrice: 2.00, // Extremely cheap due to Colossus
        mmlu: 94.9,
        math: 95.5,
        code: 94.0,
        status: 'COMPETITIVE',
        type: 'Proprietary'
    },
    {
        id: 'llama-4-1t',
        name: 'Llama 4 1T',
        provider: 'Meta',
        releaseDate: '2025-08-20',
        contextWindow: 256,
        inputPrice: 0,
        outputPrice: 0,
        mmlu: 93.5,
        math: 92.0,
        code: 91.5,
        status: 'COMPETITIVE',
        type: 'Open Source'
    },
    {
        id: 'openai-o1-final',
        name: 'OpenAI o1 (Final)',
        provider: 'OpenAI',
        releaseDate: '2025-02-14',
        contextWindow: 200,
        inputPrice: 15.00,
        outputPrice: 60.00,
        mmlu: 92.1,
        math: 96.0,
        code: 94.0,
        status: 'LEGACY',
        type: 'Proprietary'
    },
    {
        id: 'mistral-huge',
        name: 'Mistral Huge',
        provider: 'Mistral',
        releaseDate: '2025-06-01',
        contextWindow: 128,
        inputPrice: 2.00,
        outputPrice: 6.00,
        mmlu: 91.0,
        math: 89.0,
        code: 90.0,
        status: 'LEGACY',
        type: 'Proprietary'
    }
];
