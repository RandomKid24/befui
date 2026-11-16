import { PerformanceReview } from '@/components/ui/performance-review';

export default function PerformanceReviewDemo() {
  return (
    <PerformanceReview
      organization="Kiran Foods Pvt Ltd"
      title="Performance review"
      period="April to September 2026"
      number="PR-H1-0231"
      generated="5 Oct 2026"
      employee={{ name: 'Rohan Desai', role: 'Sales executive', manager: 'Anita Rao', tenure: '2 years 4 months' }}
      outcome="Meets expectations"
      goals={[
        { goal: 'Grow West region revenue by 15%', rating: 4, comment: 'Reached 18%, mostly from two new wholesale accounts.' },
        { goal: 'Keep customer complaints under 2% of orders', rating: 3, comment: 'Averaged 2.1%. September was the only month over.' },
        { goal: 'Update the CRM within a day of every call', rating: 2, comment: 'Done for about half of calls. This made handovers harder.' },
      ]}
      competencies={[
        { name: 'Communication', rating: 4 },
        { name: 'Ownership', rating: 4 },
        { name: 'Planning', rating: 3 },
        { name: 'Teamwork', rating: 3 },
      ]}
      strengths={['Builds trust quickly with new buyers', 'Takes on hard accounts without being asked']}
      improvements={['Keep CRM notes current', 'Plan the week on Monday, not Wednesday']}
      next={['Open three new retail accounts in the South', 'CRM updated daily, checked monthly']}
    />
  );
}
