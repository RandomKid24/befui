import 'package:flutter/material.dart';

import '../befui/token_meter.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  ('Plenty left', const BefTokenMeter(used: 18400, limit: 200000, cost: r'$0.04')),
  ('Getting full', const BefTokenMeter(used: 152000, limit: 200000)),
  ('Nearly out', const BefTokenMeter(used: 196500, limit: 200000)),
  (
    'Split by what it is',
    const BefTokenMeter(
      used: 88000,
      limit: 200000,
      segments: [
        BefTokenSegment('Prompt', 12000),
        BefTokenSegment('Files', 61000),
        BefTokenSegment('Reply', 15000),
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
