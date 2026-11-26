import * as React from 'react';
import { ReviewInbox, type Review } from '@/components/ui/review-inbox';

// Demo data
const start: Review[] = [
  { id: '1', author: 'Meera Nair', rating: 2, title: 'Arrived a day late', body: 'The fitting was good, but nobody told me the visit had moved to the next day. I had taken the morning off.', date: '24 Nov' },
  { id: '2', author: 'Rohan Das', rating: 5, title: 'Clean and quick', body: 'Finished in two hours and cleared up afterwards. Would book again.', date: '23 Nov' },
  { id: '3', author: 'Sana Sheikh', rating: 4, title: 'Good work, hard to reach', body: 'Happy with the result. It took three calls to confirm the time.', date: '21 Nov' },
  { id: '4', author: 'Vikram Rao', rating: 5, title: 'Fair price', body: 'The final bill matched the quote exactly.', date: '18 Nov', reply: 'Thank you, Vikram. We quote the full job so there are no surprises.' },
];

export default function ReviewInboxDemo() {
  const [reviews, setReviews] = React.useState(start);
  return <ReviewInbox className="max-w-3xl" reviews={reviews} onReply={async (id, reply) => { await new Promise((r) => setTimeout(r, 600)); setReviews((all) => all.map((r) => (r.id === id ? { ...r, reply } : r))); }} />;
}
