import { ToolCall } from '@/components/ui/tool-call';

export default function ToolCallDemo() {
  return (
    <div className="grid w-full max-w-lg gap-2">
      <ToolCall name="get_leave_balance" status="done" duration="0.4s" defaultOpen input={'{\n  "employee": "aarav.mehta",\n  "type": "casual"\n}'} output={'{\n  "balance": 7,\n  "carry_forward": 12\n}'} />
      <ToolCall name="search_policies" status="running" input={'{ "query": "encashment" }'} />
      <ToolCall name="send_email" status="error" duration="1.2s" input={'{ "to": "hr@acme.co" }'} output="SMTP 550: mailbox unavailable" />
    </div>
  );
}
