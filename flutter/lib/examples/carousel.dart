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
  return BefCarousel(
    children: [
      slide('Approvals', 'Leave and expenses in one inbox.', c.primary.withValues(alpha: 0.1)),
      slide('Payroll', 'Run it in three taps.', c.success.withValues(alpha: 0.12)),
      slide('Reports', 'Headcount and cost, always current.', c.warning.withValues(alpha: 0.12)),
    ],
  );
}
