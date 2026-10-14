import 'package:flutter/material.dart';

import '../befui/banner.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return ClipRRect(
    borderRadius: BorderRadius.circular(BefRadius.lg),
    child: DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: c.border),
        borderRadius: BorderRadius.circular(BefRadius.lg),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          BefBanner(
            action: Text(
              'Read more',
              style: BefText.style(
                context,
                size: 13,
                weight: FontWeight.w500,
                color: c.primaryForeground,
              ).copyWith(decoration: TextDecoration.underline),
            ),
            child: const Text('Payroll 2.0 is live for everyone.'),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              'Dismiss the bar and the page slides up.',
              style: BefText.style(context, color: c.mutedForeground),
            ),
          ),
        ],
      ),
    ),
  );
}
