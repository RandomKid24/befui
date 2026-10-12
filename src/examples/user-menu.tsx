import { SettingsIcon, UserCircleIcon, WalletIcon } from '@/components/ui/icons';
import { toast } from '@/components/ui/toast';
import { UserMenu } from '@/components/ui/user-menu';

export default function UserMenuDemo() {
  return (
    <UserMenu
      name="Aarav Mehta"
      email="aarav@acme.co"
      items={[
        { label: 'Profile', icon: <UserCircleIcon /> },
        { label: 'Billing', icon: <WalletIcon /> },
        { label: 'Settings', icon: <SettingsIcon /> },
      ]}
      onSignOut={() => toast.success('Signed out')}
    />
  );
}
