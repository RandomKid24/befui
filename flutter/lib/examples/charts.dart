import 'package:flutter/material.dart';

import '../befui/card.dart';
import '../befui/charts.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return _groups(context, [
    (
      'Bar chart, tap a bar',
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
    ),
    (
      'Donut chart',
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
          ],
        ),
      ),
    ),
    (
      'Sparkline',
      const SizedBox(width: 160, height: 40, child: BefSparkline(data: [4, 6, 5, 8, 7, 10, 9, 13])),
    ),
  ]);
}

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
