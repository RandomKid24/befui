import { LabReport } from '@/components/ui/lab-report';

export default function LabReportDemo() {
  return (
    <LabReport
      lab="Sahyadri Diagnostics"
      patient={{ name: 'Meera Joshi', age: '34 years', sex: 'Female', id: 'SD-558210' }}
      sample={{ collected: '14 Nov 2026, 07:40', reported: '14 Nov 2026, 13:15', doctor: 'Dr. A. Kulkarni', type: 'Blood' }}
      results={[
        { group: 'Complete blood count', name: 'Haemoglobin', value: 10.8, unit: 'g/dL', low: 12, high: 15.5 },
        { group: 'Complete blood count', name: 'White cells', value: 7.2, unit: '10³/µL', low: 4, high: 11 },
        { group: 'Complete blood count', name: 'Platelets', value: 268, unit: '10³/µL', low: 150, high: 410 },
        { group: 'Lipid profile', name: 'Total cholesterol', value: 214, unit: 'mg/dL', low: 125, high: 200 },
        { group: 'Lipid profile', name: 'HDL', value: 52, unit: 'mg/dL', low: 40, high: 60 },
        { group: 'Thyroid', name: 'TSH', value: 2.4, unit: 'mIU/L', low: 0.4, high: 4.0 },
      ]}
      note="Results are for the sample received. Please read them with your doctor along with symptoms and history."
    />
  );
}
