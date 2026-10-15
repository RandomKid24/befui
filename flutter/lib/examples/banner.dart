import 'package:flutter/material.dart';

import '../befui/banner.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  Widget framed(Widget banner) => ClipRRect(
    borderRadius: BorderRadius.circular(BefRadius.lg),
    child: DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: c.border),
        borderRadius: BorderRadius.circular(BefRadius.lg),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          banner,
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text(
              'Page content below the bar.',
              style: BefText.style(context, color: c.mutedForeground),
            ),
          ),
        ],
      ),
    ),
  );
  return _groups(context, [
    (
      'With an action, dismissible',
      framed(
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
