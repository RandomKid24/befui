import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/card.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
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
      const SizedBox(height: 16),
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
    ],
  );
}
