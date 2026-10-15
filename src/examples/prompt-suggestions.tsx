import * as React from 'react';
import { CalendarIcon, FileTextIcon, SparkleIcon, UsersIcon } from '@/components/ui/icons';
import { PromptSuggestions, type Suggestion } from '@/components/ui/prompt-suggestions';

const items: Suggestion[] = [
  { id: '1', label: 'Summarise this week', hint: 'Attendance, leave and approvals', icon: <CalendarIcon /> },
  { id: '2', label: 'Draft an offer letter', hint: 'From a role and a salary', icon: <FileTextIcon /> },
  { id: '3', label: 'Who is out tomorrow?', hint: 'Across all teams', icon: <UsersIcon /> },
  { id: '4', label: 'Explain this payslip', hint: 'Line by line, in plain words', icon: <SparkleIcon /> },
];

export default function PromptSuggestionsDemo() {
  const [picked, setPicked] = React.useState<string>();
  return (
    <div className="grid w-full max-w-xl gap-5">
      <PromptSuggestions items={items} onSelect={(s) => setPicked(s.label)} />
      <PromptSuggestions layout="chips" items={items.map(({ icon: _i, ...s }) => s)} onSelect={(s) => setPicked(s.label)} />
      <p className="text-xs text-muted-foreground">{picked ? `Picked: ${picked}` : 'Pick one.'}</p>
    </div>
  );
}
