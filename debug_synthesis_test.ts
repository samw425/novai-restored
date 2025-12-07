import { SynthesisService } from './src/lib/ai/synthesis';

async function main() {
  const articles: any[] = [
    {
      category: 'AI',
      title: 'Test Article',
      summary: 'This is a test article for synthesis.',
      source: 'TEST',
      link: 'http://example.com'
    }
  ];
  
  const brief = await SynthesisService.generateBrief(articles);
  console.log(JSON.stringify(brief, null, 2));
}

main();
