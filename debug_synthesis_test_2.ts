import { SynthesisService } from './src/lib/ai/synthesis';

async function main() {
  const articles = [
    {
      category: 'AI',
      title: 'New SOTA Model Released',
      summary: 'Tech giant releases new open source model.',
      source: 'Bloomberg',
      link: 'http://example.com'
    }
  ];
  
  const brief = await SynthesisService.generateBrief(articles);
  console.log(JSON.stringify(brief, null, 2));
}

main();
