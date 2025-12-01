import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock tools data - can be replaced with real data from GitHub API or database
const MOCK_TOOLS = [
    {
        id: 'langchain',
        title: 'LangChain',
        summary: 'Building applications with LLMs through composability. Framework for developing applications powered by language models.',
        description: 'LangChain is a framework for developing applications powered by language models.',
        source: 'GitHub',
        url: 'https://github.com/langchain-ai/langchain',
        category: 'framework',
        tags: ['llm', 'ai', 'framework'],
        stars: 75000,
        trending: true
    },
    {
        id: 'transformers',
        title: 'Hugging Face Transformers',
        summary: 'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX.',
        description: 'Transformers provides thousands of pretrained models to perform tasks on different modalities.',
        source: 'GitHub',
        url: 'https://github.com/huggingface/transformers',
        category: 'library',
        tags: ['ml', 'nlp', 'pytorch'],
        stars: 125000,
        trending: true
    },
    {
        id: 'autogen',
        title: 'AutoGen',
        summary: 'Enable next-gen large language model applications. Multi-agent conversation framework.',
        description: 'AutoGen is a framework that enables development of LLM applications using multiple agents that can converse with each other.',
        source: 'GitHub',
        url: 'https://github.com/microsoft/autogen',
        category: 'framework',
        tags: ['llm', 'agents', 'microsoft'],
        stars: 20000,
        trending: true
    },
    {
        id: 'llama-cpp',
        title: 'llama.cpp',
        summary: 'Port of Facebook\'s LLaMA model in C/C++. Efficient inference of large language models.',
        description: 'Inference of LLaMA model in pure C/C++ with no dependencies.',
        source: 'GitHub',
        url: 'https://github.com/ggerganov/llama.cpp',
        category: 'tool',
        tags: ['llm', 'inference', 'cpp'],
        stars: 55000,
        trending: false
    },
    {
        id: 'ollama',
        title: 'Ollama',
        summary: 'Get up and running with large language models locally. Run Llama 3, Mistral, and other models.',
        description: 'Ollama lets you run large language models locally on your machine.',
        source: 'GitHub',
        url: 'https://github.com/ollama/ollama',
        category: 'tool',
        tags: ['llm', 'local', 'inference'],
        stars: 65000,
        trending: true
    },
    {
        id: 'vllm',
        title: 'vLLM',
        summary: 'High-throughput and memory-efficient inference and serving engine for LLMs.',
        description: 'vLLM is a fast and easy-to-use library for LLM inference and serving.',
        source: 'GitHub',
        url: 'https://github.com/vllm-project/vllm',
        category: 'library',
        tags: ['llm', 'inference', 'serving'],
        stars: 18000,
        trending: true
    }
];

export async function GET(request: Request) {
    try {
        return NextResponse.json({
            tools: MOCK_TOOLS,
            count: MOCK_TOOLS.length,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Tools API Error:', error);
        return NextResponse.json({
            tools: [],
            error: error.message
        }, { status: 500 });
    }
}
