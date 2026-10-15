import { Thinking } from '@/components/ui/thinking';

export default function ThinkingDemo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <Thinking />
      <Thinking label="Searching the handbook" steps={[{ label: 'Read the question', done: true }, { label: 'Search leave policy', done: true }, { label: 'Compare with your balance' }]} />
      <Thinking done took="4s" steps={[{ label: 'Read the question', done: true }, { label: 'Wrote the answer', done: true }]} />
    </div>
  );
}
