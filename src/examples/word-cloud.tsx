import { WordCloud } from '@/components/ui/word-cloud';

export default function WordCloudDemo() {
  const w = (text: string, value: number) => ({ text, value });
  return (
    <WordCloud
      className="w-[36rem] max-w-full"
      words={[w('pricing', 98), w('login', 84), w('export', 61), w('invoice', 57), w('slow', 52), w('mobile', 48), w('refund', 40), w('API', 38), w('dark mode', 33), w('SSO', 30), w('billing', 28), w('search', 24), w('import', 22), w('webhook', 19), w('GST', 17), w('crash', 15), w('reports', 14), w('onboarding', 12), w('widgets', 10), w('timezone', 9)]}
    />
  );
}
