import { AgentTrace } from '@/components/ui/agent-trace';

export default function AgentTraceDemo() {
  return (
    <AgentTrace
      className="w-[48rem] max-w-full"
      spans={[
        { id: 'run', name: 'support_agent', kind: 'agent', status: 'done', start: 0, duration: 5200, children: [
          { id: 'plan', name: 'claude-sonnet · plan', kind: 'llm', status: 'done', start: 0, duration: 1100, tokens: 1820, input: 'Customer: "Where is my order 4471?"', output: 'Plan: look up the order, then the courier status.' },
          { id: 'order', name: 'get_order', kind: 'tool', status: 'done', start: 1100, duration: 380, input: '{ "id": 4471 }', output: '{ "status": "shipped", "carrier": "Delhivery", "awb": "DL88213" }' },
          { id: 'kb', name: 'search_help_center', kind: 'retrieval', status: 'done', start: 1500, duration: 640, input: 'delivery delays', output: '3 articles' },
          { id: 'track', name: 'track_shipment', kind: 'tool', status: 'error', start: 1500, duration: 2300, input: '{ "awb": "DL88213" }', output: 'Error: courier API timed out after 2s' },
          { id: 'reply', name: 'claude-sonnet · reply', kind: 'llm', status: 'done', start: 3900, duration: 1300, tokens: 2310, output: 'Your order shipped with Delhivery (AWB DL88213). Live tracking is down right now, so I will email you once it is out for delivery.' },
        ] },
      ]}
    />
  );
}
