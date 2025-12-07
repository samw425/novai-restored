const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyBVQMMGukTiKk3YVWvTWM8Y6v63-zgRdu4');
async function list() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // dummy
  // Actually SDK doesn't have listModels helper easily exposed in all versions, 
  // relying on the previous curl.
}
// Just try to generate with gemini-1.5-pro
async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); 
    const result = await model.generateContent('Hello');
    console.log('Success with gemini-1.5-pro');
    console.log(result.response.text());
  } catch(e) { console.error('Failed 1.5-pro', e.message); }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Hello');
    console.log('Success with gemini-pro');
    console.log(result.response.text());
  } catch(e) { console.error('Failed gemini-pro', e.message); }
}
test();
