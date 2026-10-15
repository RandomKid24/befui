import 'package:flutter/material.dart';

import '../befui/status_dot.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  ('Pulsing', const BefStatusDot(pulse: true, label: 'Live')),
  (
    'Tones',
    const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BefStatusDot(label: 'Online'),
        SizedBox(height: 12),
        BefStatusDot(tone: BefStatusTone.warning, label: 'Degraded'),
        SizedBox(height: 12),
        BefStatusDot(tone: BefStatusTone.danger, label: 'Offline'),
        SizedBox(height: 12),
        BefStatusDot(tone: BefStatusTone.neutral, label: 'Paused'),
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
