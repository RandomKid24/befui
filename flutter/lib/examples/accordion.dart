import 'package:flutter/material.dart';

import '../befui/accordion.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return _groups(context, [
    (
      'FAQ',
      const BefAccordion(
        initiallyOpen: ['a'],
        items: [
          BefAccordionItem(
            id: 'a',
            title: 'How are leave balances calculated?',
            content: Text('Accrual runs on the first of every month, pro-rated for new joiners.'),
          ),
          BefAccordionItem(
            id: 'b',
            title: 'Can managers delegate approvals?',
            content: Text('Yes. Set a delegate for any date range from the approvals page.'),
          ),
          BefAccordionItem(
            id: 'c',
            title: 'Where is payroll data stored?',
            content: Text('Encrypted at rest, in the region you pick at signup.'),
          ),
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
