import 'package:flutter/material.dart';

import '../befui/radar_chart.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Team against target',
    const Center(
      child: BefRadarChart(
        axes: ['Speed', 'Quality', 'Reach', 'Cost', 'Support'],
        series: [
          BefRadarSeries(name: 'This quarter', data: [80, 65, 90, 55, 70]),
          BefRadarSeries(name: 'Target', data: [70, 75, 70, 70, 75]),
        ],
      ),
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
