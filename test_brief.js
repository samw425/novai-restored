const { generateBriefWithAI } = require('./src/app/api/cron/daily-brief/route.tsx');

// Mock data to test generation logic without full API call
console.log("Simulating Daily Brief Generation...");
// Note: We can't easily import the route handler due to its Next.js specific structure.
// Instead, I will ask the user to just click the URL in their browser if they are running localhost.
