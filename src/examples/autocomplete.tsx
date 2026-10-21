import * as React from 'react';
import { Autocomplete } from '@/components/ui/autocomplete';

const places = ['Bandra, Mumbai', 'Bangalore, Karnataka', 'Banjara Hills, Hyderabad', 'Baner, Pune', 'Bhopal, Madhya Pradesh', 'Connaught Place, Delhi', 'Koramangala, Bangalore', 'Salt Lake, Kolkata'];

/** `onSearch` stands in for your geocoding API: it returns a promise of labels. Pass `options` instead for a fixed list. */
export default function AutocompleteDemo() {
  const [v, setV] = React.useState('');
  return <Autocomplete className="w-80" value={v} onValueChange={setV} placeholder="Search a place" onSearch={(q) => new Promise((r) => setTimeout(() => r(places.filter((p) => p.toLowerCase().includes(q.toLowerCase()))), 300))} />;
}
