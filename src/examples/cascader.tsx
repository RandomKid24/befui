import * as React from 'react';
import { Cascader, type CascaderOption } from '@/components/ui/cascader';

const places: CascaderOption[] = [
  { value: 'in', label: 'India', children: [
    { value: 'mh', label: 'Maharashtra', children: [{ value: 'mum', label: 'Mumbai' }, { value: 'pun', label: 'Pune' }, { value: 'nag', label: 'Nagpur' }] },
    { value: 'ka', label: 'Karnataka', children: [{ value: 'blr', label: 'Bengaluru' }, { value: 'mys', label: 'Mysuru' }] },
    { value: 'dl', label: 'Delhi', children: [{ value: 'ndl', label: 'New Delhi' }] },
  ] },
  { value: 'us', label: 'United States', children: [
    { value: 'ca', label: 'California', children: [{ value: 'sf', label: 'San Francisco' }, { value: 'la', label: 'Los Angeles' }] },
    { value: 'ny', label: 'New York', children: [{ value: 'nyc', label: 'New York City' }] },
  ] },
  { value: 'sg', label: 'Singapore' },
];

export default function CascaderDemo() {
  const [path, setPath] = React.useState<string[]>(['in', 'mh', 'pun']);
  return <Cascader options={places} value={path} onChange={setPath} placeholder="Country / state / city" />;
}
