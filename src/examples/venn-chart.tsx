import { VennChart } from '@/components/ui/venn-chart';

export default function VennChartDemo() {
  return (
    <VennChart
      sets={[{ id: 'web', label: 'Web users' }, { id: 'app', label: 'App users' }, { id: 'api', label: 'API users' }]}
      values={{ web: 420, app: 310, api: 90, 'web+app': 180, 'web+api': 40, 'app+api': 35, 'web+app+api': 22 }}
    />
  );
}
