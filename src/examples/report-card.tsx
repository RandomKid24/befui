import { ReportCard } from '@/components/ui/report-card';

export default function ReportCardDemo() {
  return (
    <ReportCard
      school="Saraswati Vidyalaya"
      year="2026 to 2027"
      student={{ name: 'Aarav Kulkarni', class: '8 B', roll: '14' }}
      terms={['Term 1', 'Term 2']}
      attendance={{ present: 168, total: 178 }}
      subjects={[
        { name: 'Mathematics', scores: [92, 96] },
        { name: 'Science', scores: [84, 88], remark: 'Strong in experiments. Write conclusions in full sentences.' },
        { name: 'English', scores: [71, 78] },
        { name: 'Hindi', scores: [66, 62] },
        { name: 'Social studies', scores: [58, 49], remark: 'Needs to revise maps and dates before tests.' },
      ]}
      teacherNote="Aarav is curious and helps others in class. A little more reading at home will lift languages and social studies."
    />
  );
}
