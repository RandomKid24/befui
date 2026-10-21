import { CohortTable } from '@/components/ui/cohort-table';

export default function CohortTableDemo() {
  return (
    <CohortTable
      className="w-[40rem] max-w-full"
      cohorts={[
        { label: 'May 2026', size: 1240, retention: [100, 62, 48, 41, 37, 34] },
        { label: 'Jun 2026', size: 1410, retention: [100, 66, 51, 44, 40] },
        { label: 'Jul 2026', size: 1580, retention: [100, 64, 50, 43] },
        { label: 'Aug 2026', size: 1722, retention: [100, 69, 55] },
        { label: 'Sep 2026', size: 1895, retention: [100, 71] },
        { label: 'Oct 2026', size: 2010, retention: [100] },
      ]}
    />
  );
}
