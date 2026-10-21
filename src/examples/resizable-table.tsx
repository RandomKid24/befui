import { ResizableTable } from '@/components/ui/resizable-table';

export default function ResizableTableDemo() {
  return (
    <ResizableTable
      className="w-[38rem] max-w-full"
      columns={[{ key: 'name', header: 'Employee', width: 180 }, { key: 'role', header: 'Role', width: 160 }, { key: 'city', header: 'City', width: 130 }, { key: 'salary', header: 'CTC', width: 110, align: 'right' }]}
      rows={[
        { name: 'Aarav Mehta', role: 'Senior Engineer', city: 'Bengaluru', salary: '₹32.0L' },
        { name: 'Diya Nair', role: 'Product Designer', city: 'Mumbai', salary: '₹24.5L' },
        { name: 'Kabir Rao', role: 'Engineering Manager', city: 'Hyderabad', salary: '₹48.0L' },
        { name: 'Meera Iyer', role: 'People Partner', city: 'Pune', salary: '₹19.0L' },
      ]}
    />
  );
}
