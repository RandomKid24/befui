import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/card.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return _groups(context, [
    (
      'Header, content and footer',
      BefCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const BefCardHeader(
              children: [BefCardTitle('Payroll run'), BefCardDescription('October cycle closes in 3 days.')],
            ),
            BefCardContent(
              child: Text(
                '142 employees, 6 pending adjustments.',
                style: BefText.style(context, size: 13, color: c.mutedForeground),
              ),
            ),
            BefCardFooter(
              alignment: MainAxisAlignment.end,
              children: [
                BefButton(
                  label: 'Later',
                  variant: BefButtonVariant.ghost,
                  size: BefButtonSize.sm,
                  onPressed: () {},
                ),
                BefButton(label: 'Review', size: BefButtonSize.sm, onPressed: () {}),
              ],
            ),
          ],
        ),
      ),
    ),
    (
      'Tappable',
      BefCard(
        onTap: () {},
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hoverable', style: BefText.style(context, weight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text(
              'Lifts 2px and gains a shadow on hover. Good for clickable tiles.',
              style: BefText.style(context, size: 13, color: c.mutedForeground),
            ),
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
