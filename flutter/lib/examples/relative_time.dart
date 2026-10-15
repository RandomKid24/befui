import 'package:flutter/material.dart';

import '../befui/relative_time.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final now = DateTime.now();
  Widget t(Duration d, {bool future = false}) => BefRelativeTime(future ? now.add(d) : now.subtract(d));
  return _groups(context, [
    (
      'Past',
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [t(const Duration(minutes: 3)), t(const Duration(hours: 5)), t(const Duration(days: 3))],
      ),
    ),
    (
      'Future',
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [t(const Duration(hours: 2), future: true), t(const Duration(days: 4), future: true)],
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
