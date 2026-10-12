import { ComparisonTable } from '@/components/ui/comparison-table';

export default function ComparisonTableDemo() {
  return (
    <ComparisonTable
      className="w-full"
      plans={[
        { id: 'free', name: 'Free', note: '₹0' },
        { id: 'pro', name: 'Pro', note: '₹499 / seat', highlighted: true },
        { id: 'biz', name: 'Business', note: '₹1,299 / seat' },
      ]}
      groups={[
        { title: 'Core', rows: [
          { feature: 'Projects', values: { free: '3', pro: 'Unlimited', biz: 'Unlimited' } },
          { feature: 'Team members', values: { free: '1', pro: '10', biz: 'Unlimited' } },
          { feature: 'Version history', values: { free: false, pro: true, biz: true } },
        ] },
        { title: 'Security', rows: [
          { feature: 'Two-factor sign-in', values: { free: true, pro: true, biz: true } },
          { feature: 'SSO (SAML)', values: { free: false, pro: false, biz: true } },
          { feature: 'Audit log', values: { free: false, pro: false, biz: true } },
        ] },
      ]}
    />
  );
}
