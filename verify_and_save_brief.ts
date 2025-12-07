import { SynthesisService } from './src/lib/ai/synthesis';
import fs from 'fs';
import path from 'path';

async function main() {
  const articles: any[] = [
    {
      category: 'AI',
      title: 'Global AI Race Accelerates',
      summary: 'Nations are pouring billions into sovereign AI clouds as the race for AGI heats up.',
      source: 'Reuters',
      link: 'http://example.com/1'
    },
    {
      category: 'Policy',
      title: 'EU AI Act Compliance Deadlines',
      summary: 'Companies face strict new deadlines for transparency and risk management under the EU AI Act.',
      source: 'Bloomberg',
      link: 'http://example.com/2'
    },
    {
      category: 'Robotics',
      title: 'Humanoid Robots in Factories',
      summary: 'Major auto manufacturers are deploying thousands of humanoid robots to assembly lines.',
      source: 'TechCrunch',
      link: 'http://example.com/3'
    },
    {
      category: 'Cyber',
      title: 'New AI Phishing Vectors',
      summary: 'Security researchers warn of highly personalized AI-generated phishing attacks targeting executives.',
      source: 'Wired',
      link: 'http://example.com/4'
    }
  ];
  
  console.log('Generating real brief...');
  const brief = await SynthesisService.generateBrief(articles);
  
  if (brief.headline.includes('SYSTEM OFFLINE')) {
      console.error('FAILED: Still generating offline brief. Check API Key.');
      process.exit(1);
  }

  // Save it
  const dataPath = path.join(process.cwd(), 'src/lib/data/generated-briefs.json');
  let existing = [];
  try {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      existing = JSON.parse(fileContent);
  } catch (e) {}

  // Remove today's existing brief if any (the offline one)
  const today = new Date().toISOString().split('T')[0];
  const filtered = existing.filter((b: any) => b.date !== today);
  
  // Add new one
  const updated = [brief, ...filtered];
  
  fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));
  console.log('SUCCESS: Overwrote generated-briefs.json with REAL intelligence.');
  console.log(JSON.stringify(brief, null, 2));
}

main();
