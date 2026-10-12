import { Button } from '@/components/ui/button';
import { BefMark, BarChartIcon, CalendarIcon, LockIcon, UsersIcon, WalletIcon, ZapIcon } from '@/components/ui/icons';
import { CtaBanner, Faq, FeatureGrid, Hero, LogoStrip, SiteFooter, StatsStrip } from '@/components/ui/landing-sections';
import { Navbar } from '@/components/ui/navbar';

export default function LandingPage() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background text-left">
      <Navbar
        brand={<><BefMark className="size-5 text-primary" /> Acme HR</>}
        links={[{ label: 'Product', href: '#product', active: true }, { label: 'Pricing', href: '#pricing' }, { label: 'Docs', href: '#docs' }]}
        actions={<><Button variant="ghost" size="sm">Sign in</Button><Button size="sm">Start free</Button></>}
      />
      <Hero
        eyebrow="Payroll is now built in"
        title="People ops that run themselves"
        description="Leave, attendance, payroll and approvals in one place, for teams of 10 to 1,000."
        actions={<><Button size="lg">Start free trial</Button><Button size="lg" variant="outline">Book a demo</Button></>}
      />
      <LogoStrip logos={['Northwind', 'Globex', 'Initech', 'Umbrella', 'Hooli']} />
      <FeatureGrid
        title="Everything your team needs"
        description="Replace four tools with one."
        features={[
          { icon: <CalendarIcon />, title: 'Leave and attendance', description: 'Requests, balances and holidays that follow your policy.' },
          { icon: <WalletIcon />, title: 'Payroll', description: 'Salary slips, tax and bank files in a couple of clicks.' },
          { icon: <UsersIcon />, title: 'Directory', description: 'Org chart, documents and onboarding for every person.' },
          { icon: <BarChartIcon />, title: 'Reports', description: 'Headcount, cost and attrition without spreadsheets.' },
          { icon: <ZapIcon />, title: 'Automations', description: 'Approvals and reminders that send themselves.' },
          { icon: <LockIcon />, title: 'Secure by default', description: 'Role-based access, SSO and a full audit log.' },
        ]}
      />
      <StatsStrip stats={[{ value: '4,200+', label: 'Teams' }, { value: '99.98%', label: 'Uptime' }, { value: '12 min', label: 'Average setup' }, { value: '4.8/5', label: 'Customer rating' }]} />
      <Faq items={[
        { id: 'a', title: 'Can I import my current data?', content: 'Yes. Upload a spreadsheet and map the columns; most teams are done in under 15 minutes.' },
        { id: 'b', title: 'Is there a free plan?', content: 'Up to 10 people are free, forever. Paid plans add payroll and SSO.' },
        { id: 'c', title: 'Where is my data stored?', content: 'In India, encrypted at rest and in transit.' },
      ]} />
      <CtaBanner title="Give your team its weekends back" description="Free for 14 days. No card needed." actions={<Button variant="secondary" size="lg">Get started</Button>} />
      <SiteFooter
        brand={<><BefMark className="size-5 text-primary" /> Acme HR</>}
        tagline="People ops for growing teams."
        columns={[
          { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'Changelog', href: '#' }] },
          { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
          { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
        ]}
        legal="© 2026 Acme Industries Pvt Ltd"
      />
    </div>
  );
}
