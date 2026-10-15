import 'package:flutter/material.dart';

import '../befui/carousel.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  Widget slide(String title, String body, Color bg) => Container(
    color: bg,
    padding: const EdgeInsets.all(24),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: BefText.style(context, size: 20, weight: FontWeight.w600)),
        const SizedBox(height: 4),
        Text(body, style: BefText.style(context, color: c.mutedForeground)),
      ],
    ),
  );
  return _groups(context, [
    (
      'Swipe or tap the dots',
      BefCarousel(
        children: [
          slide('Approvals', 'Leave and expenses in one inbox.', c.primary.withValues(alpha: 0.1)),
          slide('Payroll', 'Run it in three taps.', c.success.withValues(alpha: 0.12)),
          slide('Reports', 'Headcount and cost, always current.', c.warning.withValues(alpha: 0.12)),
        ],
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
