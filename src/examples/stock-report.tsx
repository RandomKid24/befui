import { StockReport } from '@/components/ui/stock-report';

export default function StockReportDemo() {
  return (
    <StockReport
      organization="Kiran Foods Pvt Ltd"
      title="Stock report"
      period="As of 31 October 2026"
      number="INV-2026-10"
      generated="1 Nov 2026"
      items={[
        { sku: 'OIL-GN-1L', name: 'Groundnut oil, 1 L', onHand: 640, reorderAt: 300, unitCost: 180 },
        { sku: 'ATA-SG-5K', name: 'Stone-ground atta, 5 kg', onHand: 210, reorderAt: 250, unitCost: 240 },
        { sku: 'JAG-CB-500', name: 'Jaggery cubes, 500 g', onHand: 0, reorderAt: 120, unitCost: 65 },
        { sku: 'GHE-DS-500', name: 'Desi ghee, 500 ml', onHand: 380, reorderAt: 150, unitCost: 410 },
      ]}
    />
  );
}
