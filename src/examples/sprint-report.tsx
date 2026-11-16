import { SprintReport } from '@/components/ui/sprint-report';

export default function SprintReportDemo() {
  return (
    <SprintReport
      team="Storefront"
      sprint="S24"
      dates="2 to 13 Nov 2026"
      goal="Customers can pay with UPI and see the order status without refreshing."
      committed={42}
      days={10}
      remaining={[42, 42, 39, 36, 36, 30, 27, 21, 15, 9, 6]}
      velocity={[34, 38, 31, 40]}
      done={[
        { title: 'UPI payment option', points: 13 },
        { title: 'Order status page', points: 8 },
        { title: 'Retry failed payments', points: 8 },
        { title: 'Fix cart badge count', points: 2 },
        { title: 'Tidy checkout copy', points: 5 },
      ]}
      spilled={[
        { title: 'Refund request form', points: 4, reason: 'Waiting on finance for the refund rules.' },
        { title: 'Push notifications', points: 2, reason: 'Needs the mobile team; started late.' },
      ]}
    />
  );
}
