import { TeamInvite } from '@/components/ui/team-invite';

export default function TeamInviteDemo() {
  return <TeamInvite className="w-[34rem] max-w-full" existing={['aarav@acme.co']} onSend={() => {}} />;
}
