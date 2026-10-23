import { WebhookLog } from '@/components/ui/webhook-log';

export default function WebhookLogDemo() {
  return (
    <WebhookLog
      className="w-[42rem] max-w-full"
      onResend={() => {}}
      deliveries={[
        { id: 'd1', event: 'invoice.paid', status: 200, time: '2 min ago', duration: 142, url: 'https://api.acme.co/hooks', request: '{\n  "id": "evt_1",\n  "type": "invoice.paid",\n  "amount": 4999\n}', response: '{ "ok": true }' },
        { id: 'd2', event: 'customer.created', status: 200, time: '14 min ago', duration: 98, request: '{ "id": "evt_2", "type": "customer.created" }', response: '{ "ok": true }' },
        { id: 'd3', event: 'payment.failed', status: 500, time: '1 hr ago', duration: 1210, attempt: 3, url: 'https://api.acme.co/hooks', request: '{ "id": "evt_3", "type": "payment.failed" }', response: 'Internal Server Error' },
        { id: 'd4', event: 'subscription.updated', status: 0, time: '3 hr ago', attempt: 5, request: '{ "id": "evt_4", "type": "subscription.updated" }' },
      ]}
    />
  );
}
