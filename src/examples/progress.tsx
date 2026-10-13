import { Progress } from '@/components/ui/progress';

export default function ProgressDemo() {
  return (
    <div className="grid w-80 max-w-full gap-4">
      <Progress value={64} aria-label="Upload progress" />
      <Progress value={88} tone="success" aria-label="Tasks completed" />
      <Progress value={42} tone="warning" aria-label="Storage used" />
      <Progress value={15} tone="danger" aria-label="Battery left" />
    </div>
  );
}
