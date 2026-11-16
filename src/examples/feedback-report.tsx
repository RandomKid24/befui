import { FeedbackReport } from '@/components/ui/feedback-report';

export default function FeedbackReportDemo() {
  return (
    <FeedbackReport
      organization="Kiran Foods Pvt Ltd"
      title="Customer feedback report"
      period="October 2026"
      number="CF-2026-10"
      generated="3 Nov 2026"
      ratings={[64, 98, 210, 612, 1043]}
      previousAverage={4.18}
      nps={46}
      themes={[
        { theme: 'Freshness and taste', mentions: 482, rating: 4.7, quote: 'The groundnut oil smells like it was pressed this week.' },
        { theme: 'Delivery time', mentions: 391, rating: 3.4, quote: 'Good product but it came three days after the promised date.' },
        { theme: 'Packaging', mentions: 204, rating: 3.9 },
        { theme: 'Customer support', mentions: 118, rating: 2.8, quote: 'Nobody replied to my refund email for a week.' },
      ]}
      summary="Product quality is the reason people rate us highly. Delivery speed and support replies are the two themes pulling the average down, and both are fixable."
    />
  );
}
