import 'package:flutter/material.dart';

import '../befui/line_chart.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  const labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  String lakh(double n) => '₹${n.round()}L';
  return _groups(context, [
    (
      'Area, three series, touch to read',
      BefLineChart(
        area: true,
        labels: labels,
        format: lakh,
        series: [
          const BefLineSeries(name: 'Revenue', data: [42, 48, 45, 58, 63, 61, 72]),
          BefLineSeries(
            name: 'Payroll',
            data: const [30, 31, 31, 34, 36, 36, 38],
            color: context.bef.warning,
          ),
          BefLineSeries(name: 'Profit', data: const [12, 17, 14, 24, 27, 25, 34], color: context.bef.success),
        ],
      ),
    ),
    (
      'Lines only, one series',
      BefLineChart(
        labels: labels,
        format: lakh,
        height: 160,
        series: const [
          BefLineSeries(name: 'Revenue', data: [42, 48, 45, 58, 63, 61, 72]),
        ],
      ),
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
