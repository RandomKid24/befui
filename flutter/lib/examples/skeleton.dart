import 'package:flutter/material.dart';

import '../befui/skeleton.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'List row',
    const Row(
      children: [
        BefSkeleton(height: 40, circle: true),
        SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BefSkeleton(width: 160, height: 12),
            SizedBox(height: 8),
            BefSkeleton(width: 96, height: 12),
          ],
        ),
      ],
    ),
  ),
  (
    'Text block',
    const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BefSkeleton(height: 12),
        SizedBox(height: 8),
        BefSkeleton(height: 12),
        SizedBox(height: 8),
        BefSkeleton(width: 120, height: 12),
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
