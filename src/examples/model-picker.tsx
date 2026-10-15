import * as React from 'react';
import { ModelPicker, type Model } from '@/components/ui/model-picker';

const models: Model[] = [
  { id: 'fast', name: 'Swift', description: 'Quick answers for everyday questions.', context: '128K', tags: ['Fast', 'Low cost'] },
  { id: 'balanced', name: 'Balanced', description: 'The default: good at writing, analysis and code.', context: '200K', tags: ['Vision', 'Tools'] },
  { id: 'deep', name: 'Deep', description: 'Slower, for hard problems and long documents.', context: '1M', tags: ['Reasoning', 'Vision', 'Tools'] },
];

export default function ModelPickerDemo() {
  const [id, setId] = React.useState('balanced');
  return (
    <div className="flex items-center gap-3">
      <ModelPicker models={models} value={id} onValueChange={setId} />
      <span className="text-xs text-muted-foreground">Selected: {id}</span>
    </div>
  );
}
