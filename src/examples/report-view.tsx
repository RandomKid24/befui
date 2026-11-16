import { ReportSection, ReportView } from '@/components/ui/report-view';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ReportViewDemo() {
  return (
    <ReportView
      organization="Kiran Foods Pvt Ltd"
      title="Orders by channel"
      period="October 2026"
      number="RPT-10"
      generated="2 Nov 2026"
      footer="3 channels"
      stats={[
        { label: 'Orders', value: '4,500', hint: '+6% vs September', tone: 'good' },
        { label: 'Returns', value: 82, tone: 'warn' },
        { label: 'Cancelled', value: 31 },
      ]}
    >
      <ReportSection flush title="By channel">
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="h-8 px-5 text-[11px]">Channel</TableHead><TableHead className="h-8 px-5 text-end text-[11px]">Orders</TableHead></TableRow></TableHeader>
          <TableBody>
            {[['Website', '2,310'], ['Marketplace', '1,540'], ['Phone', '650']].map(([c, n]) => (
              <TableRow key={c}><TableCell className="px-5 py-2.5">{c}</TableCell><TableCell className="px-5 py-2.5 text-end tabular-nums">{n}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </ReportSection>
    </ReportView>
  );
}
