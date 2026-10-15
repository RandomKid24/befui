import 'package:flutter/material.dart';

import '../befui/progress.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  ('Default', const BefProgress(value: 64, semanticLabel: 'Upload progress')),
  (
    'Tones',
    const Column(
      children: [
        BefProgress(value: 88, tone: BefProgressTone.success, semanticLabel: 'Tasks completed'),
        SizedBox(height: 16),
        BefProgress(value: 42, tone: BefProgressTone.warning, semanticLabel: 'Storage used'),
        SizedBox(height: 16),
        BefProgress(value: 15, tone: BefProgressTone.danger, semanticLabel: 'Battery left'),
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
