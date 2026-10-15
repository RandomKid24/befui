import 'package:flutter/material.dart';

import '../befui/separator.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  Widget link(String t) => Text(t, style: BefText.style(context, size: 13));
  return _groups(context, [
    (
      'Horizontal',
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('befui', style: BefText.style(context, size: 13, weight: FontWeight.w500)),
          Text('Slim React components.', style: BefText.style(context, size: 13, color: c.mutedForeground)),
          const SizedBox(height: 12),
          const BefSeparator(),
          const SizedBox(height: 12),
          Text('Below the line', style: BefText.style(context, size: 13)),
        ],
      ),
    ),
    (
      'Vertical',
      SizedBox(
        height: 20,
        child: Row(
          children: [
            link('Docs'),
            const SizedBox(width: 12),
            const BefSeparator(vertical: true),
            const SizedBox(width: 12),
            link('Blocks'),
            const SizedBox(width: 12),
            const BefSeparator(vertical: true),
            const SizedBox(width: 12),
            link('Source'),
          ],
        ),
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
