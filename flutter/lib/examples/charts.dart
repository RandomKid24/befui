import 'package:flutter/material.dart';

import '../befui/card.dart';
import '../befui/charts.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefCard(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Leads per month', style: BefText.style(context, weight: FontWeight.w600)),
            const SizedBox(height: 16),
            const BefBarChart(
              data: [
                BefChartPoint('May', 38),
                BefChartPoint('Jun', 52),
                BefChartPoint('Jul', 47),
                BefChartPoint('Aug', 66),
                BefChartPoint('Sep', 59),
                BefChartPoint('Oct', 81),
              ],
            ),
          ],
        ),
      ),
      const SizedBox(height: 16),
      BefCard(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Lead source', style: BefText.style(context, weight: FontWeight.w600)),
            const SizedBox(height: 20),
            BefDonutChart(
              center: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('342', style: BefText.style(context, size: 20, weight: FontWeight.w600, height: 1)),
                  Text('leads', style: BefText.style(context, size: 11, color: c.mutedForeground)),
                ],
              ),
              data: const [
                BefChartPoint('Website', 140),
                BefChartPoint('Referral', 90),
                BefChartPoint('Events', 70),
                BefChartPoint('Cold outreach', 42),
              ],
            ),
            const SizedBox(height: 20),
            const SizedBox(width: 160, height: 40, child: BefSparkline(data: [4, 6, 5, 8, 7, 10, 9, 13])),
          ],
        ),
      ),
    ],
  );
}
