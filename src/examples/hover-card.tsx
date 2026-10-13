import { Avatar } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export default function HoverCardDemo() {
  return (
    <p className="text-sm text-muted-foreground">
      Design review notes from{' '}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="#ada" className="font-medium text-foreground underline underline-offset-4">@ada</a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <Avatar name="Ada Lovelace" size="md" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Ada Lovelace</p>
              <p className="text-[13px] text-muted-foreground">Leads the design system. Reviews every new component before it ships.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      {' '}and the team.
    </p>
  );
}
