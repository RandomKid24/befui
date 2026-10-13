import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SelectDemo() {
  return (
    <div className="w-64">
      <Select defaultValue="eng">
        <SelectTrigger aria-label="Department">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Departments</SelectLabel>
            <SelectItem value="eng">Engineering</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="hr">People & Culture</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
