import 'package:flutter/material.dart';

import '../befui/testimonial_card.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'With rating',
    const BefTestimonialCard(
      rating: 5,
      name: 'Ananya Rao',
      role: 'Head of People, Northwind',
      quote: 'We replaced three spreadsheets with one screen. Approvals that took a day now take minutes.',
    ),
  ),
  (
    'Without rating',
    const BefTestimonialCard(name: 'Rohan Das', quote: 'Payroll closes in an afternoon now.'),
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
