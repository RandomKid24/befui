import 'package:flutter/material.dart';

import '../befui/theme.dart';
import '../befui/typewriter.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Looping phrases',
    const BefTypewriter(phrases: ['Ship faster.', 'Approve in one tap.', 'Run payroll on time.']),
  ),
  ('Type once', const BefTypewriter(phrases: ['Welcome aboard.'], loop: false)),
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
