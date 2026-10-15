import 'package:flutter/material.dart';

import '../befui/countdown.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  ('Launch in', BefCountdown(to: DateTime.now().add(const Duration(days: 3, hours: 4)))),
  ('Sale ends', BefCountdown(to: DateTime.now().add(const Duration(hours: 5, minutes: 30)))),
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
