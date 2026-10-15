import 'package:flutter/material.dart';

import '../befui/number_ticker.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final muted = BefText.style(context, color: context.bef.mutedForeground);
  Widget stat(Widget n, String label) => Column(
    children: [
      n,
      const SizedBox(height: 4),
      Text(label, style: muted),
    ],
  );
  return _groups(context, [
    ('Whole number', Center(child: stat(const BefNumberTicker(value: 14820), 'Employees onboarded'))),
    (
      'Decimals and suffix',
      Center(child: stat(const BefNumberTicker(value: 98.6, suffix: '%', decimals: 1), 'Payroll accuracy')),
    ),
    (
      'Prefix and suffix',
      Center(
        child: stat(const BefNumberTicker(value: 4.2, prefix: '₹', suffix: 'Cr', decimals: 1), 'Revenue'),
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
