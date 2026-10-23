import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Field } from '@/components/ui/label';

export default function AutosizeTextareaDemo() {
  return (
    <Field label="Message" htmlFor="msg" hint="Grows as you type, up to eight lines.">
      <AutosizeTextarea id="msg" className="w-96 max-w-full" minRows={2} maxRows={8} maxLength={280} placeholder="Write something..." defaultValue={'Hi team,\nThe launch moved to Friday.'} />
    </Field>
  );
}
