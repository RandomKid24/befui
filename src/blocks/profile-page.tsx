import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DescriptionList } from '@/components/ui/description-list';
import { EditIcon, MailIcon, MapPinIcon } from '@/components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeline } from '@/components/ui/timeline';

export default function ProfilePage() {
  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden">
        <div className="h-24 bg-primary/15" />
        <CardContent className="-mt-10 flex flex-wrap items-end justify-between gap-4 pb-5">
          <div className="flex items-end gap-4">
            <Avatar name="Ananya Kulkarni" size="xl" className="ring-4 ring-card" />
            <div className="grid gap-1 pb-1">
              <div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-tight">Ananya Kulkarni</h1><Badge variant="success" dot>Active</Badge></div>
              <p className="flex flex-wrap items-center gap-x-3 text-[13px] text-muted-foreground"><span>Engineering Manager</span><span className="inline-flex items-center gap-1"><MapPinIcon className="size-3.5" />Pune</span></p>
            </div>
          </div>
          <div className="flex gap-2"><Button variant="outline" size="sm"><MailIcon /> Message</Button><Button size="sm"><EditIcon /> Edit profile</Button></div>
        </CardContent>
      </Card>
      <Tabs defaultValue="about">
        <TabsList variant="pill"><TabsTrigger value="about">About</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
        <TabsContent value="about">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent>
              <DescriptionList columns={2} items={[
                { label: 'Employee ID', value: 'ACM-0142' }, { label: 'Department', value: 'Engineering' },
                { label: 'Email', value: 'ananya@acme.co' }, { label: 'Phone', value: '+91 98765 43210' },
                { label: 'Joined', value: '3 Mar 2022' }, { label: 'Reports to', value: 'Aarav Mehta' },
                { label: 'Bio', value: 'Leads the web platform team. Likes small teams and clear docs.', wide: true },
              ]} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card><CardContent className="pt-5"><Timeline items={[
            { title: 'Approved 2 leave requests', time: 'Today', tone: 'success' },
            { title: 'Merged "Checkout redesign"', time: 'Yesterday', tone: 'info' },
            { title: 'Updated team goals', time: '3 days ago' },
          ]} /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
