
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGen() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) { console.error('No Key'); return; }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Listing available models...');
    try {
        // genAI manager doesn't have listModels directly on the instance usually, it's on a manager or via rest. 
        // But the SDK often exposes it. Let's try raw fetch if SDK is opaque.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log('Models:', data.models.map(m => m.name));
    } catch (e3) {
        console.error('List Models Failed:', e3.message);
    }
    // Testing gemini-2.0-flash explicitly
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = 'Explain quantum physics in 1 sentence JSON format {"explanation": "..."}';

    console.log('Testing Gemini 2.0 Flash generation...');
    try {
        const result = await model.generateContent(prompt);
        console.log('Success:', result.response.text());
    } catch (e) {
        console.error('Gemini 2.0 Failed:', e.toString()); // Print full error string
        console.error('Error Details:', JSON.stringify(e, null, 2));
    }
}

testGen();
