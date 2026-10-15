import 'package:flutter/material.dart';

import '../befui/credit_card.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Dark, tap to flip',
    const BefCreditCard(number: '4111 1111 1111 1234', name: 'Aarav Mehta', expiry: '09/28', cvv: '482'),
  ),
  (
    'Primary, masked',
    const BefCreditCard(
      number: '5500 0000 0000 0004',
      name: 'Diya Rao',
      expiry: '01/27',
      mask: true,
      theme: BefCardTheme.primary,
    ),
  ),
  (
    'Light, still typing',
    const BefCreditCard(number: '3782 8224', name: 'Kabir Shah', theme: BefCardTheme.light),
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
