import { PricingComparison } from '@/components/ui/pricing-comparison';

export default function PricingComparisonDemo() {
  return (
    <PricingComparison
      className="w-[44rem] max-w-full"
      plans={[{ name: 'Starter', price: '₹0' }, { name: 'Team', price: '₹499', note: 'per seat, monthly', featured: true }, { name: 'Business', price: '₹1,299', note: 'per seat, monthly' }]}
      features={[
        { group: 'Core' },
        { label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
        { label: 'Team members', values: ['2', '25', '250'] },
        { label: 'Activity history', values: ['7 days', '1 year', 'Forever'] },
        { group: 'Security' },
        { label: 'Single sign-on', values: [false, false, true] },
        { label: 'Audit log', values: [false, true, true] },
        { label: 'Priority support', values: [false, true, true] },
      ]}
    />
  );
}
