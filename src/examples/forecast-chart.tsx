import { ForecastChart } from '@/components/ui/forecast-chart';

export default function ForecastChartDemo() {
  return (
    <ForecastChart
      className="w-[36rem] max-w-full"
      format={(n) => `₹${n}L`}
      labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']}
      actual={[42, 48, 45, 58, 63, 61, 72]}
      forecast={[76, 81, 84, 90]}
      low={[72, 74, 74, 77]}
      high={[80, 88, 94, 103]}
    />
  );
}
