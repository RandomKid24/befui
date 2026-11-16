import { ProjectStatusReport } from '@/components/ui/project-status-report';

export default function ProjectStatusReportDemo() {
  return (
    <ProjectStatusReport
      organization="Kiran Foods Pvt Ltd"
      title="Online store rebuild"
      period="Week 7, 9 to 15 November 2026"
      number="PSR-07"
      generated="16 Nov 2026"
      health="at risk"
      summary="Catalogue and checkout are done. Payments are late because the gateway sandbox access took three weeks. We expect to recover two of those weeks if the mobile work starts on Monday."
      milestones={[
        { name: 'Catalogue import', due: '28 Oct', state: 'done' },
        { name: 'Checkout flow', due: '8 Nov', state: 'done' },
        { name: 'Payment gateway', due: '15 Nov', state: 'off track' },
        { name: 'Mobile app beta', due: '6 Dec', state: 'at risk' },
        { name: 'Launch', due: '20 Dec', state: 'on track' },
      ]}
      budget={{ spent: 3420000, total: 4500000 }}
      risks={[
        { risk: 'Gateway approval takes longer than a week', level: 'high', owner: 'Anita Rao', plan: 'Escalated to the bank relationship manager' },
        { risk: 'One mobile developer on leave in December', level: 'medium', owner: 'Imran Shaikh' },
      ]}
      next={['Finish payment integration and test refunds', 'Start mobile beta build', 'Freeze the catalogue on 1 December']}
    />
  );
}
