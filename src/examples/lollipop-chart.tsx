import { LollipopChart } from '@/components/ui/lollipop-chart';

export default function LollipopChartDemo() {
  return (
    <LollipopChart
      className="w-[32rem] max-w-full"
      items={[
        { label: 'Checkout', value: 38 }, { label: 'Search', value: 24 }, { label: 'Profile', value: 17 }, { label: 'Notifications', value: 29 },
        { label: 'Billing', value: 12 }, { label: 'Onboarding', value: 8 }, { label: 'Reports', value: 21 },
      ]}
    />
  );
}
