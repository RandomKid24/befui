import 'package:flutter/material.dart';

import '../befui/order_tracker.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'In transit',
    const BefOrderTracker(
      current: 2,
      steps: [
        BefOrderStep(label: 'Ordered', time: '10 Oct, 9:12 am'),
        BefOrderStep(label: 'Packed', time: '10 Oct, 6:40 pm'),
        BefOrderStep(label: 'Shipped', description: 'Pune hub', time: '11 Oct, 8:05 am'),
        BefOrderStep(label: 'Out for delivery'),
        BefOrderStep(label: 'Delivered'),
      ],
    ),
  ),
  (
    'Just ordered',
    const BefOrderTracker(
      current: 0,
      steps: [
        BefOrderStep(label: 'Ordered', time: 'Today'),
        BefOrderStep(label: 'Packed'),
        BefOrderStep(label: 'Shipped'),
        BefOrderStep(label: 'Delivered'),
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
