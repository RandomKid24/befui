import { Button } from '@/components/ui/button';
import { BarChartIcon, LockIcon, ZapIcon } from '@/components/ui/icons';
import { CtaBanner, FeatureGrid, Hero, StatsStrip } from '@/components/ui/landing-sections';

export default function LandingSectionsDemo() {
  return (
    <div className="w-full">
      <Hero
        eyebrow="New: payroll in one click"
        title="Run your people ops without the spreadsheet"
        description="Leave, attendance and payroll for growing teams."
        actions={<><Button size="lg">Start free</Button><Button size="lg" variant="outline">Book a demo</Button></>}
        className="py-10"
      />
      <StatsStrip stats={[{ value: '4,200+', label: 'Teams' }, { value: '99.98%', label: 'Uptime' }, { value: '12 min', label: 'Setup' }, { value: '4.8/5', label: 'Rating' }]} />
      <FeatureGrid
        title="Everything in one place"
        features={[
          { icon: <ZapIcon />, title: 'Fast', description: 'Approve leave and run payroll in a couple of clicks.' },
          { icon: <BarChartIcon />, title: 'Clear reports', description: 'Headcount, cost and attendance without exports.' },
          { icon: <LockIcon />, title: 'Secure', description: 'Role-based access, audit log and SSO.' },
        ]}
      />
      <CtaBanner title="Ready to switch?" description="Import your team in minutes." actions={<Button variant="secondary" size="lg">Get started</Button>} />
    </div>
  );
}
