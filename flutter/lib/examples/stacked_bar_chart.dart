import 'package:flutter/material.dart';

import '../befui/stacked_bar_chart.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Hours by team, tap a bar',
    const BefStackedBarChart(
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [
        BefStackSeries(name: 'Design', data: [4, 6, 5, 7, 3]),
        BefStackSeries(name: 'Build', data: [8, 7, 9, 6, 8]),
        BefStackSeries(name: 'Review', data: [2, 1, 3, 2, 4]),
      ],
    ),
  ),
]);

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
