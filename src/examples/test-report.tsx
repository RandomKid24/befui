import { TestReport } from '@/components/ui/test-report';

export default function TestReportDemo() {
  return (
    <TestReport
      organization="Kiran Foods Pvt Ltd"
      title="Test run report"
      period="Release 2.4.0, 15 November 2026"
      number="RUN-8812"
      generated="15 Nov 2026"
      facts={[
        { label: 'Branch', value: 'release/2.4' },
        { label: 'Commit', value: 'a41f9c2' },
        { label: 'Environment', value: 'staging' },
      ]}
      suites={[
        { name: 'Catalogue', passed: 142, failed: 0, duration: 38 },
        { name: 'Checkout', passed: 96, failed: 2, skipped: 3, duration: 121 },
        { name: 'Payments', passed: 71, failed: 1, duration: 84 },
        { name: 'Accounts and login', passed: 118, failed: 0, skipped: 1, duration: 52 },
      ]}
      failures={[
        { test: 'Checkout applies coupon after address change', message: 'Expected total 1,180 but received 1,310', where: 'checkout/coupon.spec.ts:64' },
        { test: 'Checkout keeps cart across sign-in', message: 'Cart was empty after redirect', where: 'checkout/cart.spec.ts:112' },
        { test: 'Payments retry after a gateway timeout', message: 'Timed out after 5000 ms waiting for a second attempt', where: 'payments/retry.spec.ts:31' },
      ]}
    />
  );
}
